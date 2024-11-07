// import { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import { Session } from '@supabase/supabase-js';
// import { useRouter } from 'expo-router';

// export const useAuth = () => {
//   const [session, setSession] = useState<Session | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Check active session
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);
//       setIsLoading(false);
//     };

//     checkSession();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     router.replace('/logIn');
//   };

//   return {
//     session,
//     isLoading,
//     signOut,
//     isAuthenticated: !!session,
//   };
// };