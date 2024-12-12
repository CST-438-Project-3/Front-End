import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { useGoogleAuth } from '@/hooks/oauth';
import { useFonts } from 'expo-font';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { handleGoogleSignIn } = useGoogleAuth();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../assets/fonts/Montaga-Regular.ttf'),
    });

    const handleManualLogin = async () => {
        try {
            const response = await fetch('https://pantrypal15-1175d47ce25d.herokuapp.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
                credentials: 'include', // Include session/cookies
            });

            if (response.ok) {
                alert('Login successful!');
                router.push('/(tabs)'); // Redirect to the main app page
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('An unexpected error occurred during login.');
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainTitle}>Login</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#846E6E"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <View style={styles.inputLine} />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#846E6E"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.inputLine} />
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleManualLogin}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or log in with Google</Text>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
            >
                <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#524242',
    },
    mainTitle: {
        fontFamily: 'Montaga',
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputGroup: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 25,
    },
    label: {
        fontFamily: 'Montaga',
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Montaga',
        width: '100%',
        height: 40,
        color: 'white',
        fontSize: 16,
        padding: 8,
    },
    inputLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#846E6E',
        marginTop: 4,
    },
    loginButton: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        backgroundColor: '#231911',
        borderRadius: 50,
        marginVertical: 20,
    },
    loginButtonText: {
        fontFamily: 'Montaga',
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    orText: {
        fontFamily: 'Montaga',
        color: '#846E6E',
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 10,
    },
    googleButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 50,
        width: '100%',
        maxWidth: 400,
    },
    googleButtonText: {
        fontFamily: 'Montaga',
        color: '#846E6E',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LogIn;
