import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

const recipesData = [
    { 
        id: '1', 
        image: require('../../assets/images/index.png'),
        title: 'Mushroom Pasta',
        description: 'A creamy mushroom pasta with garlic and herbs.',
        ingredients: ['Mushrooms', 'Pasta', 'Garlic', 'Heavy Cream', 'Parmesan Cheese', 'Fresh Herbs']
    },
    { 
        id: '2', 
        image: require('../../assets/images/index.png'),
        title: 'Recipe 2',
        description: 'Recipe 2 description',
        ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3']
    },
    { 
        id: '3', 
        image: require('../../assets/images/index.png'),
        title: 'Recipe 3',
        description: 'Recipe 3 description',
        ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3']
    },
];

const Recipe = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'Montaga': require('../../assets/fonts/Montaga-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.recipeCard}
            onPress={() => {
                setSelectedRecipe(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.thumbnail} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#524242" />
            <View style={styles.container}>
                {/* Title and Navigation */}
                <View style={styles.header}>
                    <Text style={styles.title}>PantryPal</Text>
                    {!isMobile && (
                        <View style={styles.desktopNav}>
                            <Link href="/" style={styles.navLink}>
                                <Text style={styles.navText}>pantry</Text>
                            </Link>
                            <Link href="/recipe" style={styles.navLink}>
                                <Text style={styles.navText}>recipes</Text>
                            </Link>
                            <Link href="/restock" style={styles.navLink}>
                                <Text style={styles.navText}>restock</Text>
                            </Link>
                            <Link href="/favorites" style={styles.navLink}>
                                <Text style={styles.navText}>favorites</Text>
                            </Link>
                        </View>
                    )}
                </View>

                {/* Recipes Header */}
                <View style={styles.recipesHeader}>
                    <Text style={styles.recipesTitle}>username</Text>
                    <TouchableOpacity>
                        <Ionicons name="add" size={32} color="#BCABAB"/>
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View style={styles.searchSection}>
                    <Ionicons style={styles.searchIcon} name="search" size={20} color="#BCABAB" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search recipes..."
                        placeholderTextColor="#BCABAB"
                    />
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>recipes based on ingredients in stock</Text>

                {/* Recipe List */}
                <FlatList
                    data={recipesData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.recipeList}
                />

                {/* Mobile Bottom Navigation */}
                {isMobile && (
                    <View style={styles.bottomNav}>
                        <TouchableOpacity onPress={() => router.push('/')}>
                            <Ionicons name="home-outline" size={24} color="#BCABAB" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/recipe')}>
                            <Ionicons name="menu-outline" size={24} color="#BCABAB" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/restock')}>
                            <Ionicons name="time-outline" size={24} color="#BCABAB" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/favorites')}>
                            <Ionicons name="heart-outline" size={24} color="#BCABAB" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Recipe Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.title}>recipes</Text>
                                <TouchableOpacity>
                                    <Ionicons name="add" size={32} color="#BCABAB"/>
                                </TouchableOpacity>
                            </View>

                            {selectedRecipe && (
                                <View style={styles.modalRecipeContainer}>
                                    <View style={styles.modalImageWrapper}>
                                        <Image source={selectedRecipe.image} style={styles.modalImage} />
                                    </View>
                                    
                                    <View style={styles.recipeDetails}>
                                        <Text style={styles.recipeTitle}>{selectedRecipe.title}</Text>
                                        <Text style={styles.recipeDescription}>{selectedRecipe.description}</Text>
                                        
                                        <Text style={styles.ingredientsTitle}>Ingredients Needed:</Text>
                                        {selectedRecipe.ingredients?.map((ingredient, index) => (
                                            <Text key={index} style={styles.ingredientItem}>
                                                • {ingredient}
                                            </Text>
                                        ))}
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.backButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Ionicons name="chevron-back" size={32} color="#BCABAB" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Bottom Navigation */}
                            <View style={styles.bottomNav}>
                                <TouchableOpacity onPress={() => { setModalVisible(false); router.push('/')}}>
                                    <Ionicons name="home-outline" size={24} color="#BCABAB" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setModalVisible(false); router.push('/recipe')}}>
                                    <Ionicons name="menu-outline" size={24} color="#BCABAB" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setModalVisible(false); router.push('/restock')}}>
                                    <Ionicons name="time-outline" size={24} color="#BCABAB" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setModalVisible(false); router.push('/favorites')}}>
                                    <Ionicons name="heart-outline" size={24} color="#BCABAB" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#524242',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Montaga',
        fontSize: 46,
        color: '#BCABAB',
    },
    desktopNav: {
        flexDirection: 'row',
        alignItems: 'center',
        marginEnd: 50,
    },
    navLink: {
        marginHorizontal: 20,
    },
    navText: {
        fontFamily: 'Montaga',
        fontSize: 26,
        color: '#BCABAB',
    },
    recipesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    recipesTitle: {
        fontFamily: 'Montaga',
        fontSize: 56,
        color: '#ffffff',
    },
    searchSection: {
        flexDirection: 'row',
        backgroundColor: '#373030',
        borderRadius: 25,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    searchIcon: {
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        color: '#BCABAB',
        fontFamily: 'Montaga',
        fontSize: 16,
    },
    subtitle: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        marginBottom: 20,
    },
    recipeCard: {
        backgroundColor: '#685858',
        borderRadius: 25,
        marginBottom: 15,
        overflow: 'hidden',
    },
    imageContainer: {
        padding: 20,
    },
    thumbnail: {
        width: 115,
        height: 115,
        borderRadius: 25,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#373030',
        padding: 15,
        borderRadius: 25,
        marginTop: 'auto',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#524242',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalRecipeContainer: {
        flex: 1,
        backgroundColor: '#685858',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
    },
    modalImageWrapper: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 25,
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    recipeDetails: {
        flex: 1,
        padding: 10,
    },
    recipeTitle: {
        fontFamily: 'Montaga',
        fontSize: 28,
        color: '#ffffff',
        marginBottom: 15,
    },
    recipeDescription: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        marginBottom: 20,
        lineHeight: 24,
    },
    ingredientsTitle: {
        fontFamily: 'Montaga',
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 10,
    },
    ingredientItem: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        marginBottom: 5,
        paddingLeft: 10,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        backgroundColor: 'rgba(55, 48, 48, 0.7)',
        borderRadius: 20,
        padding: 5,
    },
});

export default Recipe;