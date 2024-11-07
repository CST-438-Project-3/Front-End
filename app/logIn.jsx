import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import * as Google from 'expo-auth-session/providers/google';
import { useFonts } from 'expo-font';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../assets/fonts/Montaga-Regular.ttf'),
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '698834273975-7pg91b1vub04e2rtbtn6sleghqq6lkrf.apps.googleusercontent.com',
        iosClientId: '698834273975-sf9t82034o2l5sgci68je6nikd3el92b.apps.googleusercontent.com'
    });

    const handleGoogleSignIn = async () => {
        try {
            const result = await promptAsync();
            if (result?.type === 'success') {
                router.push('/pantry');
            }
        } catch (error) {
            console.error('Google Sign In Error:', error);
        }
    };

    const handleSubmit = () => {
        router.push('/pantry');
    };

    const handleSignUp = () => {
        router.push('/signUp');
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainTitle}>login</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="your email"
                    placeholderTextColor="#846E6E"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <View style={styles.inputLine} />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="your password"
                    placeholderTextColor="#846E6E"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.inputLine} />
            </View>
            
            <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleSubmit}
            >
                <Text style={styles.loginButtonText}>login</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signUpLink}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or log in with google</Text>

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
        backgroundColor: '#846E6E',
    },
    mainTitle: {
        fontFamily: 'Montaga',
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 40,
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
        paddingLeft: 0,
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
        marginVertical: 30,
    },
    loginButtonText: {
        fontFamily: 'Montaga',
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    signUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    signUpText: {
        fontFamily: 'Montaga',
        color: 'white',
        fontSize: 14,
    },
    signUpLink: {
        fontFamily: 'Montaga',
        color: '#231911',
        fontSize: 14,
        marginLeft: 5,
    },
    orText: {
        fontFamily: 'Montaga',
        color: '#231911',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 20,
    },
    googleButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 50,
        width: '100%',
        maxWidth: 400,
        marginBottom: 40,
    },
    googleButtonText: {
        fontFamily: 'Montaga',
        color: '#846E6E',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default LogIn;