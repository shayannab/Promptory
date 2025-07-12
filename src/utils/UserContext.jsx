import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      console.log('Fetching initial user...');
      const { data, error } = await supabase.auth.getUser();
    
      if (error) {
        console.error('Error fetching user:', error.message);
      }
    
      const user = data?.user || null;
      console.log('Got user:', user);
    
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = (email, password, options) => supabase.auth.signUp({ email, password, ...options });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <UserContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
