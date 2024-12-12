
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get("window");
const isMobile = width < 600;


const userId = '1';

const Recipe = () => {
    const [items, setItems] = useState([]);
    const [recipesData, setRecipesData] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

  const [fontsLoaded] = useFonts({
    Montaga: require("../../assets/fonts/Montaga-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

    useEffect(() => {
        const fetchUserId = async () => {
            try {
              const userId = await AsyncStorage.getItem("userId");
              setUserId(userId);
              return userId;
            } catch (error) {
              console.error("Error fetching user ID:", error);
            }
          };
        const fetchItems = async (userId) => {
            console.log('Fetching items...');
            try {
                const response = await fetch(`https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching items:', error);
                return [];
            }
        };

        const fetchItemDetails = async (items) => {
            console.log('Fetching details:', items);
            const updatedItems = await Promise.all(items.map(async (item) => {
                try {
                    const response = await fetch(`https://pantrypal15-1175d47ce25d.herokuapp.com/items/${item.itemId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    return {
                        ...item,
                        src: data.itemUrl,
                        name: data.itemName,
                    };
                } catch (error) {
                    console.error('Error fetching item details:', error);
                    return item;
                }

            }));
            setItems(updatedItems)
            return updatedItems;
            };


        const fetchRecipes = async (items) => {
            console.log('Fetching recipes:' , items);
            const allRecipes = [];
            for (const item of items) {
                try {
                    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.name}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.meals) {
                        allRecipes.push(...data.meals);
                    }
                } catch (error) {
                    console.error('Error fetching recipes:', error);
                }
            }
            console.log('Fetched recipes:', allRecipes);
            setRecipesData(allRecipes);
        }
        
        const loadData = async () => {
            setLoading(true);
            const userId = await fetchUserId();
            const items = await fetchItems(userId);
            const updatedItems = await fetchItemDetails(items);
            await fetchRecipes(updatedItems);
            setLoading(false);
        };

        loadData();
    }, []);

    const fetchMealData = async (idMeal) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.meals[0];
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            return null;
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.recipeCard}
            onPress={async () => {
                const mealData = await fetchMealData(item.idMeal);
                setSelectedRecipe(mealData);
                setModalVisible(true);
            }}
        >
            <View style={{display:'flex', flexDirection:'row'}}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
                </View>
                <Text style={styles.recipeTitle}>{item.strMeal}</Text>
            </View>
            
        </TouchableOpacity>
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
                            <Link href="/" style={styles.navText}>my pantry</Link>
                            
                            <Text style={styles.navText}>recipes</Text>
                            
                            <Link href={"/restock"} style={styles.navText}>restock</Link>
                            
                            <Link href="/favorites" style={styles.navText}>favorites</Link>
                        </View>
                    </View>

                    {/* Username */}
                    <View style={styles.titleRow}>
                        <Text style={styles.username}>Recipes</Text>
                    </View>

                    {/* Search bar */}
                    <View style={styles.searchSection}>
                        <Ionicons style={styles.searchIcon} name="search" size={24} color="#BCABAB" />
                        <TextInput 
                            style={styles.input}
                            placeholder="Search for recipes..."
                            placeholderTextColor="#BCABAB"
                        />
                    </View>
                </View>
                    
                {/* Subtitle */}
                <Text style={styles.subtitle}>recipes based on ingredients in stock</Text>
                <View style={styles.mainContentContainer}>
                {loading ? (
                <ActivityIndicator size="large" color="#BCABAB" />
            ) : (
                <>
                    {/* Recipe List */}
                    <FlatList
                        data={recipesData}
                        renderItem={renderItem}
                        keyExtractor={item => item.idMeal}
                        contentContainerStyle={styles.recipeList}
                    />
                </> 
            )}
                </View>
               
            </View>


            {/* Recipe Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="#BCABAB" />
                        </TouchableOpacity>
                        {selectedRecipe && (
                            <>
                                <Image source={{ uri: selectedRecipe.strMealThumb }} style={styles.modalImage} />
                                <Text style={styles.modalTitle}>{selectedRecipe.strMeal}</Text>
                                <Text style={styles.modalDetails}>{selectedRecipe.strInstructions}</Text>
                                <Text>Ingredients:</Text>
                                <FlatList
                                    data={Object.entries(selectedRecipe).filter(([key, value]) => key.includes('strIngredient') && value)}
                                    renderItem={({ item }) => (
                                        <Text style={styles.ingredientItem}>{item[1]}</Text>
                                    )}
                                    keyExtractor={item => item[0]}
                                    contentContainerStyle={styles.ingredientsList}
                                />
                            </>
                        )}
                    </View>
                </SafeAreaView>
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
        flex: 1,
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
        paddingRight: 20,
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
        width: 200,
        height: 200,
        borderRadius: 25,
    },
    recipeDetails: {
        flex: 1,
        padding: 10,
    },
    recipeTitle: {
        fontFamily: 'Montaga',
        fontSize: 28,
        color: '#BCABAB',
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
        color: '#BCABAB',
        marginBottom: 10,
    },
    ingredientItem: {
        fontFamily: 'Montaga',
        fontSize: 16,
        color: '#BCABAB',
        marginBottom: 5,
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
