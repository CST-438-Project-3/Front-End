import React, { useState } from 'react';
import { View, Text } from "react-native";

const SignUp = () => {
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
        <View>
            <Text>Sign Up</Text>
        </View>
    );
}

export default SignUp;