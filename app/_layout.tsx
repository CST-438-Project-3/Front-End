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
      <Stack.Screen name="signUp" />
      <Stack.Screen name="logIn" />
      <Stack.Screen name="pantry" />
      <Stack.Screen name="recipes" />
      <Stack.Screen name="restock" />
      <Stack.Screen name="favorites" />
    </Stack>
  );
}

export default Layout;