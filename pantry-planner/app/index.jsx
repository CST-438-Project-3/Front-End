import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, ImageBackground, Pressable, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const Index = () => {
    const [fontsLoaded] = useFonts({
      Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
      MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    });

    useEffect(() => {
      SplashScreen.preventAutoHideAsync();
    }, []);

    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

    const navigation = useNavigation();

    if (!fontsLoaded) {
      return null;
    }

    return (
      <ImageBackground
        source={require('@/assets/images/index.png')}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, isMobile && styles.mobileTitle]}>PantryPal</Text>
          </View>
          <View>
            <Text style={[styles.subtitle, isMobile && styles.mobileSubtitle]}>
              Smart Pantry Management Made Simple
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => navigation.navigate('SignUp')}
              style={[styles.button, isMobile && styles.mobileButton]}
            >
              <Text style={{textAlign:"center", fontSize:isMobile ? 18 : 27}}>Get Started</Text>
            </Pressable>
            <Pressable onPress={() => {}} style={[styles.existingUserButton, isMobile && styles.mobileExistingUserButton]}>
              <Text style={styles.existingUserText}>Existing User</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    margin: isMobile ? 10 : 20,
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: "flex-start",
    paddingTop: isMobile ? 30 : 60, 
    marginBottom: isMobile ? 20 : 40,
  },
  title: {
    fontSize: 100, 
    color:"#FFFFFF",
    marginBottom: 20,
    fontFamily: "MontserratBold",
  },
  mobileTitle: {
    fontSize: 48,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontFamily: "Montserrat",
  },
  mobileSubtitle: {
    fontSize: 25,
  },
  buttonContainer: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginTop: isMobile ? 15 : 30,
  },
  button: {
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    borderRadius: 50,
    width: 316,
    height: 74,
    color: "#007AFF",
  },
  mobileButton: {
    width: 200,
    height: 50,
  },
  existingUserButton: {
    width: 316,
    marginTop: 10,
  },
  mobileExistingUserButton: {
    width: 200,
  },
  existingUserText: {
    textAlign: "center",
    color: "#FFFFFF",
  },
});
