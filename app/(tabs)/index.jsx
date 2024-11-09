import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';

const Pantry = () => {
    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PantryPal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#846E6E',
        alignItems: 'flex-left',
        padding: 20,
    },
    title: {
        fontFamily: 'Montaga',
        fontSize: 50,
        color: '#BCABAB',
        marginTop: 40,
        marginRight: 20,
    }
});

export default Pantry;