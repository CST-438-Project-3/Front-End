import * as React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

const tabs = () => {
  return (
      <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ffffff',
            tabBarStyle: {
                backgroundColor: '#373030',
                },
      }}
      >
        <Tabs.Screen name="index" options={{headerShown: false, title: 'Home',  tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),}} />   
        <Tabs.Screen name="recipes" options={{headerShown: false}} /> 
        <Tabs.Screen name="restock" options={{headerShown: false}} /> 
      </Tabs>
  );
}

export default tabs;