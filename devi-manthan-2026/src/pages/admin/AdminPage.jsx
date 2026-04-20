import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import { supabase } from '../../supabaseClient';

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    // Forcefully restore cursor for admin portal
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';

    // Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    // Listen to auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      subscription.unsubscribe();
      // Reset when leaving admin (though AppLayout handles it via class, this is safer)
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, []);

  const handleLogin = (newSession) => {
    setSession(newSession);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Still checking session
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
