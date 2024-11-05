import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="index"
        component={Index} 
        options={{headerShown: false}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;