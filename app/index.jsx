import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, ImageBackground, Pressable, Dimensions } from "react-native";
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const Index = () => {
  const [fontsLoaded] = useFonts({
    'Montaga': require('../assets/fonts/Montaga-Regular.ttf'),
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

  return (
    <ImageBackground
      source={require('../assets/images/index.png')}
      resizeMode="cover"
      style={styles.image}
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>PantryPal</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle} adjustsFontSizeToFit>
            Smart Pantry{'\n'}
            Management Made{'\n'}
            Simple
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/SignUp" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  contentContainer: {
    flex: 1,
    padding: isMobile ? 20 : 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: isMobile ? 48 : 64,
    fontFamily: 'Montaga',
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 40,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: isMobile ? 22 : 28,
    fontFamily: 'Montaga',
    lineHeight: isMobile ? 36 : 44,
    letterSpacing: 1,
    fontWeight: '200', // i made it thinner
    opacity: 0.9, // overlay
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: isMobile ? 12 : 16,
    paddingHorizontal: isMobile ? 24 : 32,
    borderRadius: 50,
    width: isMobile ? 200 : 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#524242",
    fontSize: isMobile ? 16 : 20,
    fontFamily: 'Montaga',
  },
});

export default Index;