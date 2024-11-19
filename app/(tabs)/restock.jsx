import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView, Image, Modal, TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const restockItems = [
    { id: '1', src: require('../../assets/images/index.png') },
    { id: '2', src: require('../../assets/images/index.png') },
    { id: '3', src: require('../../assets/images/index.png') },
    { id: '4', src: require('../../assets/images/index.png') },
    { id: '5', src: require('../../assets/images/index.png') },
    { id: '6', src: require('../../assets/images/index.png') },
    { id: '7', src: require('../../assets/images/index.png') },
    { id: '8', src: require('../../assets/images/index.png') },
    { id: '9', src: require('../../assets/images/index.png') },
    { id: '10', src: require('../../assets/images/index.png') },
    { id: '11', src: require('../../assets/images/index.png') },
    { id: '12', src: require('../../assets/images/index.png') },
];

const Restock = () => {
    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (!fontsLoaded) return null;

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

    const renderGrid = (startIndex) => (
        <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
                {restockItems.slice(startIndex, startIndex + 3).map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.imageBackground}
                        onPress={() => openModal(item)}
                    >
                        <Image source={item.src} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.gridRow}>
                {restockItems.slice(startIndex + 3, startIndex + 6).map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.imageBackground}
                        onPress={() => openModal(item)}
                    >
                        <Image source={item.src} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
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
                    <Link href="/restock" style={styles.navText}>
                        <Text >restock</Text>
                    </Link>
                    <Link href="/favorites" style={styles.navText}>
                        <Text >favorites</Text>
                    </Link>
                </View>
            </View>
           

            {/* Username */}
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={styles.username}>Restock</Text>
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
            <View style={styles.content}>
                <View style={styles.headerSection}>
                </View>

                {/* Scrollable Content */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {[0, 6].map((startIndex) => renderGrid(startIndex))}
                </ScrollView>
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
    content: {
        width: '100%',
        paddingLeft: 20,
    },
    headerSection: {
        paddingRight: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: isMobile ? 32 : 40,
        alignItems: 'center',
    },
    navigation: {
        flexDirection: 'row',
        marginEnd: 50,
        display: isMobile ? 'none' : 'flex',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    scrollContainer: {
        left: 1200, 
        paddingRight: 40,
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
    gridContainer: {
        marginRight: 40,
    },
    gridRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    imageBackground: {
        width: 200,
        height: 300,
        backgroundColor: '#685858',
        borderRadius: 25,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 115,
        height: 115,
        borderRadius: 25,
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

export default Restock;