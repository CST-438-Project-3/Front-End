import { Stack } from 'expo-router';
import React from 'react';

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none'
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="logIn" />
    </Stack>
  );
}

export default Layout;