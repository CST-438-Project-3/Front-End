import React, { useState, Fragment, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Modal,
    Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';

const SignUp = () => {
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(""); 
    const [name, setName] = useState("");
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../assets/fonts/Montaga-Regular.ttf'),
    });

    const isWeb = Platform.OS === 'web';


    const handleGoogleSignIn = async () => {

    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const payload = {
            username: username,
            email: "",
            password: password,
            name: "", 
            role: "USER",
        };
    
        console.log("Payload:", payload);
    
        try {
            const response = await fetch("https://pantrypal15-1175d47ce25d.herokuapp.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            // text from the response instead of JSON
            let responseBody = "";
            try {
                responseBody = await response.text();  // get response as text
            } catch (textError) {
                console.error("Error parsing response as text:", textError);
                responseBody = "Unexpected error, response is not text.";
            }
    
            console.log("Response status:", response.status);
            console.log("Response body:", responseBody);
    
            if (response.ok) {
                alert("User registered successfully!");
            } else {
                throw new Error(responseBody || "An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Error occurred:", error.message);
        }
    };
    
    
    const handleLogin = async () => {
        router.push('/logIn');
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
                {errorMessage ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="your username"
                    placeholderTextColor="#846E6E"
                    value={username}
                    onChangeText={setUsername}
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
                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.inputLine} />
            </View>
            
            <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <Text style={styles.signUpButtonText}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginLink}>Log in</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.orText}>or sign up with google</Text>

            {isWeb ? (
                <form
                    action="https://pantrypal15-1175d47ce25d.herokuapp.com/oauth2/authorization/google"
                    method="get"
                >
                    <input type="submit" value="Sign in with Google" />
                </form>
            ) : (
                <TouchableOpacity 
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                >
                    <Text style={styles.googleButtonText}>Google</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Montaga',
    },
    errorContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 10,
        padding: 10,
    },
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
    disabledButton: {
        opacity: 0.7,
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
        color: '#B19696',
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