import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TextInput, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const imageSources = [
    { id: '1', src: require('../../assets/images/index.png') },
    { id: '2', src: require('../../assets/images/index.png') },
    { id: '3', src: require('../../assets/images/index.png') },
    { id: '4', src: require('../../assets/images/index.png') },
    { id: '5', src: require('../../assets/images/index.png') },
    { id: '6', src: require('../../assets/images/index.png') },
    { id: '7', src: require('../../assets/images/index.png') },
    { id: '8', src: require('../../assets/images/index.png') },
    { id: '9', src: require('../../assets/images/index.png') },
    {id: '10', src: require('../../assets/images/index.png')},
];

const Pantry = () => {
    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const renderItem = ({ item }) => (
        <Image source={item.src} style={styles.image} />
    );

    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 40}}>
                <Text style={styles.title}>PantryPal</Text>

                {/* Navigation */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginEnd: 50, display: isMobile ? 'none' : 'flex'}}>
                    <Text style={styles.navText}>my pantry</Text>
                    <Link href="/recipe" style={styles.navText}>
                        <Text >recipes</Text>
                    </Link>
                    <Text style={styles.navText}>restock</Text>
                    <Text style={styles.navText}>favorites</Text>
                </View>
            </View>
           

            {/* Username */}
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={styles.username}>username</Text>
                <Ionicons name="add" size={40} color="#BCABAB"/>
            </View>

            {/* Search bar */}
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={22} color="#BCABAB" />
                <TextInput
                    style={styles.input}
                    // onChangeText={}
                />
            </View>

            {/* Categories */}
            <View style={{flexDirection:'column'}}>
                <View style={{alignItems:'center'}}>
                <ScrollView horizontal>
                    <View style={{flexDirection:'row', marginBottom:15}}>
                        <Text style={styles.categoryText}>spices</Text>
                        <Text style={styles.categoryText}>canned goods</Text>
                        <Text style={styles.categoryText}>oils</Text>
                        <Text style={styles.categoryText}>peppers</Text>
                    </View>
                </ScrollView>
                </View>
              

                {/* Images */}
               <View style={{paddingBottom: 250, flex: 1}}>
                <FlatList
                        data={imageSources}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={isMobile ? 2 : 4}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
               </View>
               
                
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#524242',
        alignItems: 'flex-left',
        padding: 20,
    },
    title: {
        fontFamily: 'Montaga',
        fontSize: 46,
        color: '#BCABAB',
    },
    navText: {
        fontFamily: 'Montaga',
        fontSize: 26,
        color: '#BCABAB',
        margin: 20,
    },
    username: {
        fontFamily: 'Montaga',
        fontSize: 56,
        color: '#ffffff',
    },
    searchSection: {
        flexDirection: 'row',
        backgroundColor: '#373030',
        borderRadius: 30,
        marginVertical: 20,
    },
    searchIcon: {
        padding: 10,
    },
    input: {
       flex: 1,
       padding: 10,
       color: '#BCABAB',
    },
    row: {
        justifyContent: 'space-evenly',
    },
    categoryText: {
        marginStart: 20,
        fontFamily: 'Montaga',
        fontSize: 26,
        color: '#BCABAB',
    },
    image: {
        width: 153,
        height: 199,
        marginBottom: 20,
        borderRadius: 20,
    },
});

export default Pantry;