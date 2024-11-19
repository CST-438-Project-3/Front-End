import * as React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from "react-native";
import { Tabs } from 'expo-router';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const tabs = () => {
  return (
      <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ffffff',
            tabBarStyle: {
                backgroundColor: '#373030',
                borderTopWidth: 0,
                height: 60,
                display: isMobile? 'flex' : 'none',
                },
            tabBarShowLabel: false,
            headerShown: false,
      }}
      >
        <Tabs.Screen name="index" options={{title: 'Home',  tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),}} />   
        <Tabs.Screen name="recipe" options={{tabBarIcon:({color})=> (
          <Ionicons name="list" size={24} color={color} />
        ),}} /> 
        <Tabs.Screen name="restock" options={{tabBarIcon:({color})=> (
          <Ionicons name="time" size={24} color={color} />
        ),}} /> 
        <Tabs.Screen name="favorites" options={{tabBarIcon:({color})=> (
          <Ionicons name="heart" size={24} color={color} />
        ),}} /> 
      </Tabs>
  );
}

export default tabs;