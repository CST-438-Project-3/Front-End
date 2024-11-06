import * as React from 'react';
import { Stack } from 'expo-router';

const App = () => {
  return (
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} />
        <Stack.Screen name="SignIn" options={{headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack>
  );
}

export default App;