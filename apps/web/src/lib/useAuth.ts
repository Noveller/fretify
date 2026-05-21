import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// DEV FLAG: set to true to bypass premium check locally
const DEV_PREMIUM = false;

export interface AuthState {
  user: User | null;
  isPremium: boolean;
  loading: boolean;
  signIn:  (email: string, password: string) => Promise<string | null>;
  signUp:  (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser]       = useState<User | null>(null);
  const [isPremium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchPremium(uid: string) {
    if (DEV_PREMIUM) { setPremium(true); return; }
    const { data } = await supabase
      .from('users')
      .select('is_premium, premium_until')
      .eq('id', uid)
      .single();
    const active = data?.is_premium &&
      (!data.premium_until || new Date(data.premium_until) > new Date());
    setPremium(!!active);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPremium(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPremium(session.user.id);
      else setPremium(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return error?.message ?? null;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, isPremium, loading, signIn, signUp, signOut };
}
