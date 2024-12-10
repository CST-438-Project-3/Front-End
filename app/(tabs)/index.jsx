import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePantry } from '../hooks/usePantry';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const categories = [
    'papers',
    'fruit',
    'vegetable',
    'meat',
    'seafood',
    'dairy',
    'grain',
    'condiment'
];

const Index = () => {
    const { fetchItems } = usePantry();
    
    console.log('Index component rendering');

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [pantryItems, setPantryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newItemData, setNewItemData] = useState({
        item_name: '',
        item_category: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const router = useRouter();
    const { addPantryItem } = usePantry();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    useEffect(() => {
        const loadItems = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Starting to load items...');
                const items = await fetchItems();
                console.log('Received items:', items);
                
                if (Array.isArray(items)) {
                    setPantryItems(items);
                    setFilteredItems(items);
                } else {
                    console.error('Received non-array data:', items);
                    setError('Invalid data format received');
                }
            } catch (error) {
                console.error('Error in loadItems:', error);
                setError('Failed to load items: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadItems();
    }, []);

    if (!fontsLoaded) {
        console.log('Fonts not loaded yet');
        return null;
    }

    const handleLogout = () => {
        setIsUserModalVisible(false);
        router.push('/logIn');
    };

    const handleAddItem = async () => {
        try {
            console.log('Adding new item:', newItemData);
            const newItem = await addPantryItem({
                item_name: newItemData.pantryName,  // Use item_name
                item_category: newItemData.category,  // Use item_category
            });
            console.log('Added item response:', newItem);
            setPantryItems(prevItems => [...prevItems, newItem]);
            setFilteredItems(prevItems => [...prevItems, newItem]);
            setIsAddModalVisible(false);
            setNewItemData({ pantryName: '', category: '' });
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };
    
    const handleCategoryFilter = (category) => {
        console.log('Filtering by category:', category);
        setSelectedCategory(category === selectedCategory ? null : category);
        if (category && category !== selectedCategory) {
            const filtered = pantryItems.filter(item => item.item_category === category);
            console.log('Filtered items:', filtered);
            setFilteredItems(filtered);
        } else {
            setFilteredItems(pantryItems);
        }
    };

    const renderGrid = (startIndex) => {
        if (!filteredItems?.length) {
            return (
                <View style={styles.gridContainer}>
                    <Text style={[styles.itemTitle, { fontSize: 18, marginTop: 20 }]}>
                        No items found
                    </Text>
                </View>
            );
        }
    
        return (
            <View style={styles.gridContainer}>
                <View style={styles.gridRow}>
                    {filteredItems.slice(startIndex, startIndex + 3).map((item) => (
                        <TouchableOpacity 
                            key={item.item_id}  
                            style={styles.imageBackground}
                        >
                            <Text style={styles.itemTitle}>{item.item_name}</Text>  
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };
    

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.loadingText}>Loading pantry items...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>PantryPal</Text>
                        <View style={styles.navigation}>
                            <Text style={styles.navText}>pantry</Text>
                            <Link href="/recipe" style={styles.navText}>
                                <Text style={styles.navText}>recipes</Text>
                            </Link>
                            <Link href="/restock" style={styles.navText}>
                                <Text style={styles.navText}>restock</Text>
                            </Link>
                            <Link href="/favorites" style={styles.navText}>
                                <Text style={styles.navText}>favorites</Text>
                            </Link>
                        </View>
                    </View>

                    <View style={styles.titleRow}>
                        <Text style={styles.username}>username</Text>
                        <View style={styles.userControls}>
                            <TouchableOpacity 
                                style={styles.addButton}
                                onPress={() => setIsAddModalVisible(true)}
                            >
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

                    <View style={styles.searchSection}>
                        <Ionicons style={styles.searchIcon} name="search" size={24} color="#BCABAB" />
                        <TextInput 
                            style={styles.input}
                            placeholder="Search pantry..."
                            placeholderTextColor="#BCABAB"
                        />
                    </View>
                </View>

                <View style={styles.mainContentContainer}>
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

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {renderGrid(0)}
                    </ScrollView>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsAddModalVisible(false)}
                >
                    <View style={styles.addModalContent}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Item Name"
                            value={newItemData.item_name}
                            onChangeText={(text) => setNewItemData({...newItemData, pantryName: text})}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Category"
                            value={newItemData.item_category}
                            onChangeText={(text) => setNewItemData({...newItemData, category: text})}
                        />
                        <TouchableOpacity 
                            style={styles.addItemButton}
                            onPress={handleAddItem}
                        >
                            <Text style={styles.addItemButtonText}>Add Item</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
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
        paddingRight: 20,
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
        marginTop: 20,
    },
    categoriesContainer: {
        width: 100,
        backgroundColor: '#373030',
        borderRadius: 15,
        paddingVertical: 20,
        marginRight: 20,
        alignSelf: 'flex-start',
    },
    categoryButton: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    selectedCategory: {
        backgroundColor: '#524242',
    },
    scrollContainer: {
        paddingRight: 40,
    },
    gridContainer: {
        flex: 1,
        paddingRight: 20,
    },
    gridRow: {
        flexDirection: 'row',
        marginBottom: 20,
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
        fontFamily: 'Montaga',
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
    categoryText: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        textAlign: 'center',
    },
    userControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    loadingText: {
        color: '#BCABAB',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Montaga',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Montaga',
    },
    modalInput: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        fontFamily: 'Montaga',
    },
    addModalContent: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: [{translateX: -150}],
        backgroundColor: '#373030',
        borderRadius: 15,
        padding: 20,
        width: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
    addItemButton: {
        backgroundColor: '#524242',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addItemButtonText: {
        color: '#BCABAB',
        fontFamily: 'Montaga',
        fontSize: 16,
    },
    itemTitle: {
        color: '#BCABAB',
        fontFamily: 'Montaga',
        fontSize: 16,
        textAlign: 'center'
    },
    userModalText: {
        fontFamily: 'Montaga',
        color: '#BCABAB',
        fontSize: 16,
    },
    userButton: {
        padding: 5,
    },
    addButton: {
        padding: 5,
    },
});

export default Index;