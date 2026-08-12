import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Warning: Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. ' +
    'The application is running in offline mode. Configure .env to restore database actions.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () =>
          Promise.reject(
            new Error(
              'Supabase connection details are missing. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
            )
          ),
        signUp: () => Promise.reject(new Error('Supabase is not configured.')),
        signOut: () => Promise.resolve(),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null }),
          }),
          order: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        insert: () => Promise.reject(new Error('Supabase is not configured.')),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      functions: {
        invoke: () =>
          Promise.reject(
            new Error('Supabase is not configured. Submission and evaluation functions are unavailable.')
          ),
      },
      channel: () => ({
        on: () => ({
          subscribe: () => {},
        }),
      }),
      removeChannel: () => {},
    };

/**
 * Format roll number as a virtual email for Supabase Auth.
 */
export const formatRollNumberToEmail = (rollNumber) => {
  return `${rollNumber.trim().toLowerCase()}@design-event.com`;
};

/**
 * Log in a participant using their Roll Number.
 * Roll numbers are translated to virtual emails.
 */
export const loginParticipantService = async (rollNumber) => {
  const formattedRoll = rollNumber.trim().toUpperCase();

  try {
    // 1. Call database RPC function to authenticate atomically and acquire active session lock
    const { data: rpcData, error: rpcError } = await supabase.rpc('authenticate_participant', {
      p_roll_number: formattedRoll
    });

    if (rpcError) {
      throw new Error(rpcError.message || 'Database RPC connection failed.');
    }

    if (!rpcData.success) {
      throw new Error(rpcData.error || 'Access denied.');
    }

    // 2. Store active session details in sessionStorage
    sessionStorage.setItem('design_event_session_id', rpcData.session_id);
    sessionStorage.setItem('design_event_user_id', rpcData.user_id);

    const user = { id: rpcData.user_id, roll_number: formattedRoll };

    return { user, session_id: rpcData.session_id };
  } catch (error) {
    return { error };
  }
};

/**
 * Log out a participant and clear the active session lock in database.
 */
export const logoutParticipantService = async () => {
  try {
    const userId = sessionStorage.getItem('design_event_user_id');
    if (userId) {
      await supabase.rpc('release_participant_session', { p_user_id: userId });
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.rpc('release_participant_session', { p_user_id: session.user.id });
      }
    }
  } catch (e) {
    console.error('Failed to release participant session:', e);
  } finally {
    sessionStorage.removeItem('design_event_session_id');
    sessionStorage.removeItem('design_event_user_id');
    await supabase.auth.signOut();
  }
};

/**
 * Admin Login
 */
export const loginAdminService = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Verify they are in the admins table
    const { data: adminRecord, error: adminErr } = await supabase
      .from('admins')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      // Not an admin
      await supabase.auth.signOut();
      throw new Error('Access denied: User is not registered as an administrator.');
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    return { error };
  }
};

/**
 * Get current participant data
 */
export const getParticipantProfile = async (userId) => {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data, error };
};

/**
 * Record participant click on "Start Round"
 */
export const startParticipantRound = async (userId) => {
  const { data, error } = await supabase
    .from('participants')
    .update({
      started_at: new Date().toISOString(),
      status: 'started'
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

/**
 * Get all tasks (excluding target layouts)
 */
export const getTasksService = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, instruction, reference_asset, max_points, public_config')
    .order('id', { ascending: true });
  return { data, error };
};

/**
 * Submit design JSON for evaluation
 * Calls the Supabase Edge Function to calculate the score server-side
 */
export const submitDesignService = async (designJson, sessionId) => {
  try {
    const activeSessionId = sessionId || sessionStorage.getItem('design_event_session_id') || '';

    // 1. Call database RPC evaluation function directly for atomic, instant server-side scoring
    const { data: rpcData, error: rpcError } = await supabase.rpc('evaluate_submission_rpc', {
      p_design_json: designJson,
      p_session_id: activeSessionId
    });

    if (!rpcError && rpcData?.success) {
      return { data: rpcData, error: null };
    }

    if (rpcError && !rpcError.message.includes('Could not find')) {
      throw new Error(rpcError.message);
    }

    // 2. Fallback to Edge Function invocation
    const { data, error } = await supabase.functions.invoke('evaluate-submission', {
      body: { designJson, sessionId: activeSessionId }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Submission function error:', error);
    return { error };
  }
};

/**
 * Retrieve current user's submission & results
 */
export const getSubmissionResult = async (participantId) => {
  const { data: submission, error: subError } = await supabase
    .from('submissions')
    .select('*')
    .eq('participant_id', participantId)
    .maybeSingle();

  if (subError || !submission) {
    return { submission: null, results: [], error: subError };
  }

  const { data: results, error: resError } = await supabase
    .from('task_results')
    .select('*')
    .eq('submission_id', submission.id);

  return { submission, results, error: resError };
};

/**
 * Admin: Get active dashboard metrics
 */
export const getAdminStatsService = async () => {
  // Fetch participants
  let query = supabase.from('participants').select('id, status, final_score');
  const { data: participants, error } = await query;

  if (error) return { error };

  const total = participants.length;
  const active = participants.filter(p => p.status === 'started').length;
  const completed = participants.filter(p => p.status === 'submitted').length;
  const pending = participants.filter(p => p.status === 'pending').length;

  const scores = participants.filter(p => p.status === 'submitted').map(p => Number(p.final_score));
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
  const maxScore = scores.length ? Math.max(...scores) : 0;

  return {
    data: {
      total,
      active,
      completed,
      pending,
      avgScore,
      maxScore
    }
  };
};

/**
 * Admin: Get Leaderboard
 */
export const getAdminLeaderboardService = async () => {
  let query = supabase
    .from('participants')
    .select('id, roll_number, name, final_score, started_at, submitted_at, status')
    .order('final_score', { ascending: false });

  const { data, error } = await query;
  return { data, error };
};

/**
 * General: Get event settings
 */
export const getEventSettingsService = async () => {
  const { data, error } = await supabase
    .from('event_settings')
    .select('*')
    .eq('id', 'round_1')
    .maybeSingle();

  return { data, error };
};

/**
 * Admin: Update event status (SCHEDULED -> LIVE -> CLOSED)
 */
export const updateEventStatusService = async (newStatus) => {
  const { data, error } = await supabase.rpc('update_event_status', {
    p_status: newStatus
  });

  return { data, error };
};

/**
 * Admin: Reset Round 1 participant attempt data, active session locks, submissions, and task results
 */
export const resetRound1DataService = async () => {
  try {
    // 1. Try calling the database RPC reset function
    const { data: rpcData, error: rpcError } = await supabase.rpc('reset_round1_attempts');
    if (!rpcError && rpcData?.success) {
      return { success: true };
    }

    // 2. Fallback to client queries
    const { data: pData } = await supabase.from('participants').select('id').eq('year', 3);
    const pIds = (pData || []).map(p => p.id);

    if (pIds.length > 0) {
      const { data: subData } = await supabase.from('submissions').select('id').in('participant_id', pIds);
      const subIds = (subData || []).map(s => s.id);

      if (subIds.length > 0) {
        await supabase.from('task_results').delete().in('submission_id', subIds);
      }
      await supabase.from('submissions').delete().in('participant_id', pIds);

      await supabase.from('participants').update({
        status: 'pending',
        started_at: null,
        submitted_at: null,
        final_score: 0,
        active_session_id: null
      }).in('id', pIds);
    }

    await supabase.from('event_settings').update({
      status: 'SCHEDULED',
      started_at: null,
      closed_at: null,
      updated_at: new Date().toISOString()
    }).eq('id', 'round_1');

    return { success: true };
  } catch (error) {
    console.error('Reset Round 1 Data Error:', error);
    return { error };
  }
};
