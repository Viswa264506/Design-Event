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
  const year = parseInt(import.meta.env.VITE_APP_YEAR || '2', 10);
  const formattedRoll = rollNumber.trim().toUpperCase();

  try {
    // 1. Call database RPC function to authenticate atomically and acquire active session lock
    const { data: rpcData, error: rpcError } = await supabase.rpc('authenticate_participant', {
      p_roll_number: formattedRoll,
      p_year: year
    });

    if (rpcError) {
      throw new Error(rpcError.message || 'Database RPC connection failed.');
    }

    if (!rpcData.success) {
      throw new Error(rpcData.error || 'Access denied.');
    }

    // 2. Lock confirmed, sign in via Supabase Auth using deterministic credentials
    const email = formatRollNumberToEmail(rollNumber);
    const password = `Pass_${rollNumber.trim().toLowerCase()}_Fest2026!`;

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // If auth sign-in fails, immediately release the session lock in database
      await supabase.rpc('release_participant_session', { p_user_id: rpcData.user_id });
      throw authError;
    }

    // 3. Store active session ID in sessionStorage
    sessionStorage.setItem('design_event_session_id', rpcData.session_id);

    return { user: data.user, session: data.session, session_id: rpcData.session_id };
  } catch (error) {
    return { error };
  }
};

/**
 * Log out a participant and clear the active session lock in database.
 */
export const logoutParticipantService = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Call RPC to clear active session in database
      await supabase.rpc('release_participant_session', { p_user_id: session.user.id });
    }
  } catch (e) {
    console.error('Failed to release participant session:', e);
  } finally {
    await supabase.auth.signOut();
    sessionStorage.removeItem('design_event_session_id');
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
    // Invoke edge function
    const { data, error } = await supabase.functions.invoke('evaluate-submission', {
      body: { designJson, sessionId }
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
export const getAdminStatsService = async (yearFilter) => {
  // Fetch participants for the year
  let query = supabase.from('participants').select('id, status, final_score');
  if (yearFilter) {
    query = query.eq('year', yearFilter);
  }
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
export const getAdminLeaderboardService = async (yearFilter) => {
  let query = supabase
    .from('participants')
    .select('id, roll_number, name, year, final_score, started_at, submitted_at, status')
    .order('final_score', { ascending: false });

  if (yearFilter) {
    query = query.eq('year', yearFilter);
  }

  const { data, error } = await query;
  return { data, error };
};
