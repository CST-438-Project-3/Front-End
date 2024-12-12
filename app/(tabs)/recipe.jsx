import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isMobile = width < 600;

const Recipe = () => {
  const [items, setItems] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
        return userId;
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    const fetchItems = async (userId) => {
      console.log("Fetching items...");
      try {
        const response = await fetch(
          `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Fetched items:", data);
        const dataInStock = data.filter((item) => item.quantity > 0);
        console.log("Items in stock:", dataInStock);
        return dataInStock;
      } catch (error) {
        console.error("Error fetching items:", error);
        return [];
      }
    };

    const fetchItemDetails = async (items) => {
      console.log("Fetching details:", items);
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await fetch(
              `https://pantrypal15-1175d47ce25d.herokuapp.com/items/${item.itemId}`
            );
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
            console.error("Error fetching item details:", error);
            return item;
          }
        })
      );
      setItems(updatedItems);
      return updatedItems;
    };

    const fetchRecipes = async (items) => {
      console.log("Fetching recipes:", items);
      const allRecipes = [];
      for (const item of items) {
        try {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.name}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.meals) {
            allRecipes.push(...data.meals);
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      }
      console.log("Fetched recipes:", allRecipes);
      setRecipesData(allRecipes);
    };

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
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error("Error fetching ingredients:", error);
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
        <View style={styles.recipeCardContent}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
            </View>
            <View style={styles.recipeTextContainer}>
                <Text style={styles.recipeTitle}>{item.strMeal}</Text>
                <TouchableOpacity style={styles.viewRecipeButton}>
                    <Text style={styles.viewRecipeText}>View Recipe</Text>
                </TouchableOpacity>
            </View>
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
              <Link href="/" style={styles.navText}>
                my pantry
              </Link>

              <Text style={styles.navText}>recipes</Text>

              <Link href={"/restock"} style={styles.navText}>
                restock
              </Link>

              <Link href="/favorites" style={styles.navText}>
                favorites
              </Link>
            </View>
          </View>

          {/* Username */}
          <View style={styles.titleRow}>
            <Text style={styles.username}>Recipes</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchSection}>
            <Ionicons
              style={styles.searchIcon}
              name="search"
              size={24}
              color="#BCABAB"
            />
            <TextInput
              style={styles.input}
              placeholder="Search for recipes..."
              placeholderTextColor="#BCABAB"
            />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          recipes based on ingredients in stock
        </Text>
        <View style={styles.mainContentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#BCABAB" />
          ) : (
            <>
              {/* Recipe List */}
              <FlatList
                data={recipesData}
                renderItem={renderItem}
                keyExtractor={(item) => item.idMeal}
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
              <View style={styles.modalRecipeContainer}>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: selectedRecipe.strMealThumb }}
                    style={styles.modalImage}
                  />
                </View>
                <View style={styles.recipeDetails}>
                  <Text style={styles.modalTitle}>
                    {selectedRecipe.strMeal}
                  </Text>
                  <View style={styles.divider} />

                  <Text style={styles.modalSubtitle}>Instructions</Text>
                  <Text style={styles.modalDescription}>
                    {selectedRecipe.strInstructions}
                  </Text>

                  <View style={styles.divider} />

                  <Text style={styles.modalSubtitle}>Ingredients</Text>
                  <FlatList
                    data={Object.entries(selectedRecipe).filter(
                      ([key, value]) => key.includes("strIngredient") && value
                    )}
                    renderItem={({ item }) => (
                      <Text style={styles.ingredientItem}>• {item[1]}</Text>
                    )}
                    keyExtractor={(item) => item[0]}
                    contentContainerStyle={styles.ingredientsList}
                  />
                </View>
              </View>
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
    backgroundColor: "#524242",
  },
  content: {
    flex: 1,
    paddingLeft: 20,
  },
  headerSection: {
    paddingRight: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: isMobile ? 32 : 40,
    alignItems: "center",
  },
  navigation: {
    flexDirection: "row",
    marginEnd: 50,
    display: isMobile ? "none" : "flex",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  mainContentContainer: {
    flex: 1,
    flexDirection: "row",
    paddingRight: 20,
  },
  title: {
    fontFamily: "Montaga",
    fontSize: isMobile ? 36 : 46,
    color: "#BCABAB",
  },
  navText: {
    fontFamily: "Montaga",
    fontSize: isMobile ? 22 : 26,
    color: "#BCABAB",
    margin: 20,
  },
  username: {
    fontFamily: "Montaga",
    fontSize: isMobile ? 42 : 56,
    color: "#ffffff",
  },
  searchSection: {
    flexDirection: "row",
    backgroundColor: "#373030",
    borderRadius: 30,
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    color: "#BCABAB",
    fontSize: 16,
  },
  subtitle: {
        fontFamily: 'Montaga',
        fontSize: 18,
        color: '#BCABAB',
        marginBottom: 25,
        marginTop: 10,
        opacity: 0.8,
    },
    
    recipeCard: {
        backgroundColor: '#685858',
        borderRadius: 25,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    recipeCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    
    imageContainer: {
        marginRight: 20,
    },
    
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    
    recipeTextContainer: {
        flex: 1,
        justifyContent: 'space-between',
        height: 100,
    },
    
    recipeTitle: {
        fontFamily: 'Montaga',
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 10,
        flex: 1,
    },
    
    viewRecipeButton: {
        backgroundColor: '#373030',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    
    subtitle: {
        fontFamily: 'Montaga',
        fontSize: 18,
        color: '#BCABAB',
        marginBottom: 25,
        marginTop: 10,
        opacity: 0.8,
    },
    
    recipeCard: {
        backgroundColor: '#685858',
        borderRadius: 25,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    recipeCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    
    imageContainer: {
        marginRight: 20,
    },
    
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    
    recipeTextContainer: {
        flex: 1,
        justifyContent: 'space-between',
        height: 100,
    },
    
    recipeTitle: {
        fontFamily: 'Montaga',
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 10,
        flex: 1,
    },
    
    viewRecipeButton: {
        backgroundColor: '#373030',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    
    viewRecipeText: {
        fontFamily: 'Montaga',
        color: '#BCABAB',
        fontSize: 14,
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
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#373030",
    padding: 15,
    borderRadius: 25,
    marginTop: "auto",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#524242",
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  modalRecipeContainer: {
    flex: 1,
    backgroundColor: "#685858",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  modalImageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: "#373030",
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 25,
  },
  recipeDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontFamily: "Montaga",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#BCABAB",
    marginVertical: 15,
    opacity: 0.3,
  },
  modalSubtitle: {
    fontFamily: "Montaga",
    fontSize: 20,
    color: "#BCABAB",
    marginBottom: 8,
  },
  modalDescription: {
    fontFamily: "Montaga",
    fontSize: 14,
    color: "#BCABAB",
    lineHeight: 20,
    maxHeight: 200,
    overflow: "scroll",
  },
  ingredientsList: {
    paddingTop: 5,
  },
  ingredientItem: {
    fontFamily: "Montaga",
    fontSize: 14,
    color: "#BCABAB",
    marginBottom: 5,
    paddingLeft: 5,
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "rgba(55, 48, 48, 0.7)",
    borderRadius: 20,
    padding: 5,
  },
});

export default Recipe;