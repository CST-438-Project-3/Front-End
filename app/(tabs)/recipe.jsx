import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, FlatList, Image, Modal, TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

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


const Recipe = () => {
    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const ItemModal = ({ item, visible, onClose }) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={onClose}
                    >
                        <Ionicons name="arrow-back" size={24} color="#BCABAB" />
                    </TouchableOpacity>
                    <Image source={item?.src} style={styles.modalImage} />
                    <View style={styles.modalInfo}>
                        <Text style={styles.modalTitle}>Item Details</Text>
                        <Text style={styles.modalDetails}>Quantity: 2 left</Text>
                        <Text style={styles.modalDetails}>Expiry: 12/31/2024</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderItem = ({ item }) => (
        <View style={styles.imageBackground}>
            <TouchableOpacity onPress={() => openModal(item)}>
            <Image 
                source={item.src} 
                style={styles.image} 
            />
            </TouchableOpacity>
             
        </View>
       
    );

    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 40}}>
                <Text style={styles.title}>PantryPal</Text>

                {/* Navigation */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginEnd: 50, display: isMobile ? 'none' : 'flex'}}>
                    <Link href="/" style={styles.navText}>
                        <Text>my pantry</Text>
                    </Link>
                    <Link href="/recipe" style={styles.navText}>
                        <Text >recipes</Text>
                    </Link>
                    <Link href="/restock" style={styles.navText}>
                        <Text >restock</Text>
                    </Link>
                    <Link href="/favorites" style={styles.navText}>
                        <Text >favorites</Text>
                    </Link>
                </View>
            </View>

            {/* Recipes text */}
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={styles.username}>Recipes</Text>
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


            <View style={{alignSelf: 'center', flex: 1}}>
                <FlatList
                    data={imageSources}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={isMobile ? 1 : 3 }
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>

            <ItemModal 
                item={selectedItem}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

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
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    searchIcon: {
        padding: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        color: '#BCABAB',
        fontSize: 16,
    },
    categoryText: {
        marginStart: 20,
        fontFamily: 'Montaga',
        fontSize: 26,
        color: '#BCABAB',
    },
    image: {
        width: 115,
        height: 115,
        borderRadius: 25,
        margin: 20,
    },
    imageBackground: {
        width: 370,
        height: 157,
        backgroundColor: '#685858',
        alignItems: 'left',
        borderRadius: 25,
        margin: 20,
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: isMobile ? '90%' : '60%',
        backgroundColor: '#685858',
        borderRadius: 25,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
        height:700,
        width: 500,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 25,
        marginVertical: 20,
    },
    modalInfo: {
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: 'Montaga',
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 10,
    },
    modalDetails: {
        fontFamily: 'Montaga',
        fontSize: 18,
        color: '#BCABAB',
        marginBottom: 5,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        zIndex: 1,
    },
});

export default Recipe;