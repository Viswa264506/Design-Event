import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main scoring function
function evaluateTask(studentElements: any[], expectedElements: any[]): { score: number, details: any } {
  if (!expectedElements || expectedElements.length === 0) {
    return { score: 10, details: { feedback: 'No elements expected for this task.' } };
  }

  let totalTaskScore = 0;
  const elementFeedbacks: string[] = [];
  let matchedCount = 0;

  // Expected elements scoring weights: Position = 4, Sizing = 3, Styling = 3
  const targetElementWeight = 10 / expectedElements.length;

  for (const expected of expectedElements) {
    const student = studentElements.find((el: any) => el.id === expected.id);
    
    if (!student) {
      elementFeedbacks.push(`Missing element: ${expected.id}`);
      continue;
    }

    matchedCount++;
    let elementScore = 0;

    // 1. Position evaluation (Weight: 40% of element score)
    const posXWeight = 2.0;
    const posYWeight = 2.0;
    let posScore = 0;

    const diffX = Math.abs(student.x - expected.x);
    if (diffX <= 3) posScore += posXWeight;
    else if (diffX <= 6) posScore += posXWeight * 0.5; // near-miss

    const diffY = Math.abs(student.y - expected.y);
    if (diffY <= 3) posScore += posYWeight;
    else if (diffY <= 6) posScore += posYWeight * 0.5;

    elementScore += posScore;

    // 2. Dimensions evaluation (Weight: 30% of element score)
    const widthWeight = 1.5;
    const heightWeight = 1.5;
    let dimScore = 0;

    const diffW = Math.abs(student.width - expected.width);
    if (diffW <= 3) dimScore += widthWeight;
    else if (diffW <= 6) dimScore += widthWeight * 0.5;

    const diffH = Math.abs(student.height - expected.height);
    if (diffH <= 3) dimScore += heightWeight;
    else if (diffH <= 6) dimScore += heightWeight * 0.5;

    elementScore += dimScore;

    // 3. Styling evaluation (Weight: 30% of element score)
    let styleScore = 0;
    let styleChecks = 0;

    if (expected.type === 'text') {
      styleChecks = 4; // color, fontSize, fontWeight, align
      
      // Color check
      if (expected.color && student.color) {
        if (expected.color.toUpperCase() === student.color.toUpperCase()) styleScore += 1;
      } else styleScore += 1;

      // FontSize check
      if (expected.fontSize && student.fontSize) {
        if (Math.abs(student.fontSize - expected.fontSize) <= 1) styleScore += 1;
      } else styleScore += 1;

      // FontWeight check
      if (expected.fontWeight && student.fontWeight) {
        if (student.fontWeight === expected.fontWeight) styleScore += 0.5;
      } else styleScore += 0.5;

      // Alignment check
      if (expected.align && student.align) {
        if (student.align === expected.align) styleScore += 0.5;
      } else styleScore += 0.5;

    } else if (expected.type === 'rectangle') {
      styleChecks = 2; // color, borderRadius
      
      // Color
      if (expected.color && student.color) {
        if (expected.color.toUpperCase() === student.color.toUpperCase()) styleScore += 1.5;
      } else styleScore += 1.5;

      // Border radius
      if (expected.borderRadius !== undefined && student.borderRadius !== undefined) {
        if (Math.abs(student.borderRadius - expected.borderRadius) <= 2) styleScore += 1.5;
      } else styleScore += 1.5;

    } else if (expected.type === 'circle') {
      styleChecks = 1; // color
      
      if (expected.color && student.color) {
        if (expected.color.toUpperCase() === student.color.toUpperCase()) styleScore += 3;
      } else styleScore += 3;

    } else {
      styleScore = 3; // Image/preset type inherits default style marks
    }

    elementScore += (styleScore / (styleChecks || 1)) * 3; // scale styleScore to max 3 points
    totalTaskScore += (elementScore / 10) * targetElementWeight; // weight this element's score
  }

  // Deduct penalty for extra components (0.5 points per extra element, max 2.0 points penalty)
  const extraCount = Math.max(0, studentElements.length - expectedElements.length);
  const penalty = Math.min(2.0, extraCount * 0.5);
  totalTaskScore = Math.max(0, totalTaskScore - penalty);

  let feedback = 'Matches expected layout guidelines.';
  if (matchedCount === 0) {
    feedback = 'Unresolved. Task elements missing.';
  } else if (penalty > 0) {
    feedback = `Evaluated with extra elements penalty of -${penalty.toFixed(1)} pts.`;
  } else if (totalTaskScore < 9.9) {
    feedback = 'Close, but sizing/position bounds require tuning.';
  }

  return {
    score: parseFloat(totalTaskScore.toFixed(2)),
    details: {
      feedback,
      elementsFound: matchedCount,
      elementsExpected: expectedElements.length,
      penaltyApplied: penalty,
      breakdown: elementFeedbacks
    }
  };
}

serve(async (req) => {
  // CORS check
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Setup Supabase with Service Role to write results and bypass RLS constraints
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and get user ID
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { designJson, sessionId } = await req.json();
    if (!designJson) {
      return new Response(JSON.stringify({ error: 'Missing design evaluation content payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch participant details
    const { data: participant, error: profileErr } = await supabaseClient
      .from('participants')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileErr || !participant) {
      return new Response(JSON.stringify({ error: 'Participant profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify session ID matches active lock
    if (!sessionId || participant.active_session_id !== sessionId) {
      return new Response(JSON.stringify({ error: 'Session expired or active on another device.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enforce submission bounds & locks
    if (participant.status === 'submitted') {
      return new Response(JSON.stringify({ error: 'Submission locked. Challenge already finalized.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!participant.started_at) {
      return new Response(JSON.stringify({ error: 'Round has not been started yet.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-side timer check: 25 minutes + 1 minute grace buffer = 26 minutes max
    const startTime = new Date(participant.started_at).getTime();
    const currentTime = new Date().getTime();
    const elapsedTimeMin = (currentTime - startTime) / (60 * 1000);
    const maxAllowedTimeMin = 26;

    if (elapsedTimeMin > maxAllowedTimeMin) {
      // Force status update and return timer expired error
      await supabaseClient
        .from('participants')
        .update({ status: 'submitted', submitted_at: new Date().toISOString(), active_session_id: null })
        .eq('id', user.id);

      return new Response(JSON.stringify({ error: 'Timer expired. Submission rejected.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch private expected answers
    const { data: answers, error: answersErr } = await supabaseClient
      .from('task_answers')
      .select('*');

    if (answersErr || !answers) {
      return new Response(JSON.stringify({ error: 'Internal scoring configurations not loaded' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Evaluate each task
    const taskScoringDetails: any[] = [];
    let totalScore = 0;

    for (const answerKey of answers) {
      const taskId = answerKey.task_id;
      const expectedElements = answerKey.target_layout.elements || [];
      const studentElements = designJson[taskId] || [];

      const result = evaluateTask(studentElements, expectedElements);
      totalScore += result.score;

      taskScoringDetails.push({
        task_id: taskId,
        score: result.score,
        evaluation_details: result.details
      });
    }

    // Capture submission timestamp
    const submissionTime = new Date().toISOString();

    // Transaction execution (Sequential Writes using Service Role)
    // 1. Write Submission
    const { data: subRecord, error: subWriteErr } = await supabaseClient
      .from('submissions')
      .insert({
        participant_id: user.id,
        design_json: designJson,
        total_score: totalScore,
        submitted_at: submissionTime,
        status: 'submitted'
      })
      .select()
      .single();

    if (subWriteErr) {
      throw new Error(`Failed to write submission: ${subWriteErr.message}`);
    }

    // 2. Write Task Breakdown Results
    const resultsPayload = taskScoringDetails.map(d => ({
      submission_id: subRecord.id,
      task_id: d.task_id,
      score: d.score,
      evaluation_details: d.evaluation_details
    }));

    const { error: resultsWriteErr } = await supabaseClient
      .from('task_results')
      .insert(resultsPayload);

    if (resultsWriteErr) {
      throw new Error(`Failed to write task results: ${resultsWriteErr.message}`);
    }

    // 3. Finalize Participant profile
    const { error: participantUpdateErr } = await supabaseClient
      .from('participants')
      .update({
        final_score: totalScore,
        submitted_at: submissionTime,
        status: 'submitted',
        active_session_id: null
      })
      .eq('id', user.id);

    if (participantUpdateErr) {
      throw new Error(`Failed to update participant: ${participantUpdateErr.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        score: totalScore,
        submittedAt: submissionTime
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
