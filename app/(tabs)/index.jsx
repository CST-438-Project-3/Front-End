import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const categories = [
    'papers',
    'oils',
    'canned goods',
    'spices'
];

const pantryItems = [
    { id: '1', image: require('../../assets/images/index.png'), category: 'papers', title: 'Paper Towels' },
    { id: '2', image: require('../../assets/images/index.png'), category: 'oils', title: 'Olive Oil' },
    { id: '3', image: require('../../assets/images/index.png'), category: 'canned goods', title: 'Beans' },
    { id: '4', image: require('../../assets/images/index.png'), category: 'spices', title: 'Basil' },
    { id: '5', image: require('../../assets/images/index.png'), category: 'papers', title: 'Napkins' },
    { id: '6', image: require('../../assets/images/index.png'), category: 'oils', title: 'Coconut Oil' },
];

const Index = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredItems, setFilteredItems] = useState(pantryItems);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    if (!fontsLoaded) return null;

    const handleLogout = () => {
        setIsUserModalVisible(false);
        router.push('/logIn');
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category);
        if (category && category !== selectedCategory) {
            const filtered = pantryItems.filter(item => item.category === category);
            setFilteredItems(filtered);
        } else {
            setFilteredItems(pantryItems);
        }
    };

    const renderGrid = (startIndex) => (
        <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
                {filteredItems.slice(startIndex, startIndex + 3).map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.imageBackground}
                    >
                        <Image source={item.image} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.gridRow}>
                {filteredItems.slice(startIndex + 3, startIndex + 6).map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.imageBackground}
                    >
                        <Image source={item.image} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    {/* Title */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>PantryPal</Text>
                        {/* Navigation */}
                        <View style={styles.navigation}>
                            <Text style={styles.navText}>my pantry</Text>
                            <Link href="/recipe" style={styles.navText}>
                                <Text>recipes</Text>
                            </Link>
                            <Link href="/restock" style={styles.navText}>
                                <Text>restock</Text>
                            </Link>
                            <Link href="/favorites" style={styles.navText}>
                                <Text>favorites</Text>
                            </Link>
                        </View>
                    </View>

                    {/* Username and Controls */}
                    <View style={styles.titleRow}>
                        <Text style={styles.username}>username</Text>
                        <View style={styles.userControls}>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={isMobile ? 32 : 40} color="#BCABAB"/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setIsUserModalVisible(true)}
                                style={styles.userButton}
                            >
                                <Ionicons name="person-circle-outline" size={isMobile ? 32 : 40} color="#BCABAB"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search bar */}
                    <View style={styles.searchSection}>
                        <Ionicons style={styles.searchIcon} name="search" size={24} color="#BCABAB" />
                        <TextInput 
                            style={styles.input}
                            placeholder="Search pantry..."
                            placeholderTextColor="#BCABAB"
                        />
                    </View>
                </View>
                {/* Main Content Area */}
                <View style={styles.mainContentContainer}>
                    {/* Categories */}
                    <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity 
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category && styles.selectedCategory
                                ]}
                                onPress={() => handleCategoryFilter(category)}
                            >
                                <Text style={styles.categoryText}>{category}</Text>
                            </TouchableOpacity>
                        ))}
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
            </View>

            {/* User Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isUserModalVisible}
                onRequestClose={() => setIsUserModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsUserModalVisible(false)}
                >
                    <View style={styles.userModalContent}>
                        <TouchableOpacity 
                            style={styles.userModalItem}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#BCABAB" />
                            <Text style={styles.userModalText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#524242',
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
    mainContentContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    categoriesContainer: {
        width: 100,
        backgroundColor: '#373030',
        borderRadius: 15,
        paddingVertical: 20,
        marginRight: 20,
    },
    categoryButton: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    categoryText: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        textAlign: 'center',
    },
    selectedCategory: {
        backgroundColor: '#524242',
    },
    scrollContainer: {
        paddingRight: 40,
    },
    title: {
        fontFamily: 'Montaga',
        fontSize: isMobile ? 36 : 46,
        color: '#BCABAB',
    },
    navText: {
        fontFamily: 'Montaga',
        fontSize: isMobile ? 22 : 26,
        color: '#BCABAB',
        margin: 20,
    },
    username: {
        fontFamily: 'Montaga',
        fontSize: isMobile ? 42 : 56,
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
    userControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    userButton: {
        padding: 5,
    },
    addButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    userModalContent: {
        position: 'absolute',
        top: 100,
        right: 20,
        backgroundColor: '#373030',
        borderRadius: 15,
        padding: 10,
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userModalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    userModalText: {
        fontFamily: 'Montaga',
        color: '#BCABAB',
        fontSize: 16,
    },
    imageBackground: {
        margin: 20,
        justifyContent: 'center',
    },
});

export default Index;