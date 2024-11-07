import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const SignUp = () => {
    const [fontsLoaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
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

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <View style={styles.container}>
            <View style={{width:500}}>
                <Text style={styles.text}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    // onChangeText={onChangeNumber}
                    // value={number}
                    placeholder="Your full name"
                    keyboardType="default"
                />
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    keyboardType="email-address"
                />
                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <Text style={styles.text}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                />
            </View>
           <View style={{alignItems:"center"}}>
           <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            <Text>Already have an account? <Pressable><Text>Log in</Text></Pressable></Text>
           </View>
            
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom right, #B89393,#866C6C, #675353,#524242)'
    },
    button: {
        backgroundColor: '#373030',
        width: 315,
        height:47,
        borderRadius: 50,
        shadowColor: '#373030',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Montserrat',
    },
    text: {
        color: '#FFFFFF'
    },
    input: {
        borderBottomColor: '#373030',
        borderBottomWidth: 1,
    }
});


