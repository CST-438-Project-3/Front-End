import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, ImageBackground, Pressable, Dimensions } from "react-native";
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const Index = () => {
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'), 
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('@/assets/images/index.png')}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={{ margin: isMobile ? 10 : 20}}>
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: isMobile ? 48 : 100 }]}>PantryPal</Text>
        </View>
        <View>
          <Text style={[styles.subtitle, { fontSize: isMobile ? 25 : 36 }]}>
            Smart Pantry Management Made Simple
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/signUp" style={styles.button}>
            <Text style={{ fontFamily:"MontserratSemiBold",textAlign: "center", fontSize: isMobile ? 18 : 27 }}>Get Started</Text>
          </Link>
          {/* <Pressable
            onPress={() => navigation.navigate('SignUp')}
            style={[styles.button, isMobile ? styles.mobileButton : {}]}
          >
            <Text style={{ textAlign: "center", fontSize: isMobile ? 18 : 27 }}>Get Started</Text>
          </Pressable> */}
          <Pressable onPress={() => {}} style={[styles.existingUserButton, isMobile ? styles.mobileExistingUserButton : {}]}>
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
    margin: 20,
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: "flex-start",
    paddingTop: 60, 
    marginBottom: 40,
  },
  title: {
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "MontserratBold",
  },
  subtitle: {
    color: "#FFFFFF",
    fontFamily: "Montserrat",
  },
  buttonContainer: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#D9D9D9",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 316,
    height: 74,
    color: "#4A3424",
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
