import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, loginParticipantService, logoutParticipantService, loginAdminService, getParticipantProfile } from './supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && mounted) {
          // Check if admin
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (adminRecord) {
            setUser(session.user);
            setIsAdmin(true);
            return;
          }
        }

        // Check participant session storage
        const participantUserId = sessionStorage.getItem('design_event_user_id');
        const clientSessionId = sessionStorage.getItem('design_event_session_id');

        if (participantUserId && mounted) {
          const { data: profileRecord } = await getParticipantProfile(participantUserId);

          if (profileRecord && profileRecord.active_session_id !== clientSessionId) {
            console.warn('Session ID mismatch on mount. Force logging out.');
            sessionStorage.removeItem('design_event_session_id');
            sessionStorage.removeItem('design_event_user_id');
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          } else if (profileRecord) {
            setUser({ id: participantUserId, roll_number: profileRecord.roll_number });
            setProfile(profileRecord);
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('Session restoration error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session && session.user) {
        setLoading(true);
        // Check if admin
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (adminRecord) {
          setUser(session.user);
          setIsAdmin(true);
          setProfile(null);
        } else {
          const { data: profileRecord } = await getParticipantProfile(session.user.id);
          const clientSessionId = sessionStorage.getItem('design_event_session_id');

          if (profileRecord && profileRecord.active_session_id !== clientSessionId) {
            console.warn('Session ID mismatch on auth change. Force logging out.');
            await supabase.auth.signOut();
            sessionStorage.removeItem('design_event_session_id');
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          } else {
            setUser(session.user);
            setProfile(profileRecord);
            setIsAdmin(false);
          }
        }
        setLoading(false);
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginParticipant = async (rollNumber) => {
    setLoading(true);
    const res = await loginParticipantService(rollNumber);
    if (!res.error) {
      setUser(res.user);
      const { data: profileRecord } = await getParticipantProfile(res.user.id);
      setProfile(profileRecord);
      setIsAdmin(false);
    }
    setLoading(false);
    return res;
  };

  const loginAdmin = async (email, password) => {
    setLoading(true);
    const res = await loginAdminService(email, password);
    if (!res.error) {
      setUser(res.user);
      setIsAdmin(true);
      setProfile(null);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await logoutParticipantService();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user && !isAdmin) {
      const { data: profileRecord } = await getParticipantProfile(user.id);
      setProfile(profileRecord);
      return profileRecord;
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    loginParticipant,
    loginAdmin,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
