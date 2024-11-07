import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Modal,
    Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import * as Google from 'expo-auth-session/providers/google';
import { useFonts } from 'expo-font';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
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
        setShowModal(true);
        setEmail('');
        setPassword('');

        setTimeout(() => {
            setShowModal(false);
            router.push('/logIn');
        }, 2000);
    };

    const handleLogin = () => {
        router.push('/logIn');
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.mainContainer}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Account Created Successfully!</Text>
                    </View>
                </View>
            </Modal>

            <Text style={styles.mainTitle}>Sign Up</Text>

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
                style={styles.signUpButton}
                onPress={handleSubmit}
            >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginLink}>Log in</Text>
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
    signUpButton: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        backgroundColor: '#231911',
        borderRadius: 50,
        marginVertical: 30,
    },
    signUpButtonText: {
        fontFamily: 'Montaga',
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    loginText: {
        fontFamily: 'Montaga',
        color: 'white',
        fontSize: 14,
    },
    loginLink: {
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#231911',
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        fontFamily: 'Montaga',
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default SignUp;