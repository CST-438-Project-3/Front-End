// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createClient } from '@supabase/supabase-js';
// import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';

// const customStorageAdapter = {
//   getItem: (key) => AsyncStorage.getItem(key),
//   setItem: (key, value) => AsyncStorage.setItem(key, value),
//   removeItem: (key) => AsyncStorage.removeItem(key),
// };

// export const supabase = createClient(
//   EXPO_PUBLIC_SUPABASE_URL,
//   EXPO_PUBLIC_SUPABASE_ANON_KEY,
//   {
//     auth: {
//       storage: customStorageAdapter,
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//     },
//   }
// );