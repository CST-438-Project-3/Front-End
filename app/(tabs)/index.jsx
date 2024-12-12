import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { usePantry } from "../hooks/usePantry";

const { width } = Dimensions.get("window");
const isMobile = width < 600;

const categories = [
  "papers",
  "fruit",
  "vegetable",
  "meat",
  "seafood",
  "dairy",
  "grain",
  "condiment",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);

  const [newItemData, setNewItemData] = useState({
    item_name: "",
    item_category: "",
    item_url: "",
    item_quantity: "",
    is_favorite: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { fetchItems, addItem, toggleFavorite } = usePantry();

  const [fontsLoaded] = useFonts({
    Montaga: require("../../assets/fonts/Montaga-Regular.ttf"),
  });

  useEffect(() => {
    const checkAuthAndLoadItems = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                router.push("/logIn");
                return;
            }
            loadItems();
        } catch (error) {
            console.error("Error checking auth:", error);
            router.push("/logIn");
        }
    };

    checkAuthAndLoadItems();
}, []);
  // New effect to handle both search and category filtering
  useEffect(() => {
    let result = pantryItems;

    // Apply category filter if selected
    if (selectedCategory) {
      result = result.filter((item) => item.itemCategory === selectedCategory);
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query) ||
          item.itemCategory.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, pantryItems]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const items = await fetchItems();
      if (Array.isArray(items)) {
        setPantryItems(items);
        setFilteredItems(items);
      } else {
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("Error loading items:", error);
      setError("Failed to load items: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem("userId");
        setIsUserModalVisible(false);
        router.push("/logIn");
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

  const handleFavoriteToggle = async (itemId) => {
    try {
      const currentItem = pantryItems.find((item) => item.id === itemId);
      if (!currentItem) return;

      const currentStatus = Boolean(currentItem.is_favorite);
      const newFavoriteStatus = !currentStatus;

      const updatedItems = pantryItems.map((item) =>
        item.id === itemId ? { ...item, is_favorite: newFavoriteStatus } : item
      );

      setPantryItems(updatedItems);
      setFilteredItems(
        selectedCategory
          ? updatedItems.filter(
              (item) => item.itemCategory === selectedCategory
            )
          : updatedItems
      );

      // Update modal if open
      if (selectedItem?.id === itemId) {
        setSelectedItem((prev) => ({
          ...prev,
          is_favorite: newFavoriteStatus,
        }));
      }

      // Call API with boolean value
      await toggleFavorite(itemId, newFavoriteStatus);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      loadItems();
    }
  };

  const handleAddItem = async () => {
    try {
      const newItem = await addItem(newItemData);
      setPantryItems((prev) => [...prev, newItem]);
      setIsAddModalVisible(false);
      setNewItemData({
        item_name: "",
        item_category: "",
        item_url: "",
        item_quantity: "",
        is_favorite: false,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  if (!fontsLoaded) return null;

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

  const renderGrid = (startIndex) => {
    if (!filteredItems?.length) {
      return (
        <View style={styles.gridContainer}>
          <Text style={styles.itemTitle}>No items found</Text>
        </View>
      );
    }

    return (
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          {filteredItems.slice(startIndex, startIndex + 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.imageBackground}
              onPress={() => {
                setSelectedItem(item);
                setIsItemModalVisible(true);
              }}
            >
              <Image source={{ uri: item.itemUrl }} style={styles.itemImage} />
              <TouchableOpacity
                style={[
                  styles.favoriteIconContainer,
                  item.is_favorite && styles.favoriteIconContainerActive,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(item.id);
                }}
              >
                <Ionicons
                  name={item.is_favorite ? "heart" : "heart-outline"}
                  size={24}
                  color={item.is_favorite ? "#ff6b6b" : "#685858"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

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
                <Ionicons
                  name="add"
                  size={isMobile ? 32 : 40}
                  color="#BCABAB"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsUserModalVisible(true)}
                style={styles.userButton}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={isMobile ? 32 : 40}
                  color="#BCABAB"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchSection}>
            <Ionicons
              style={styles.searchIcon}
              name="search"
              size={24}
              color="#BCABAB"
            />
            <TextInput
              style={styles.input}
              placeholder="Search pantry..."
              placeholderTextColor="#BCABAB"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons name="close-circle" size={20} color="#BCABAB" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.mainContentContainer}>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory,
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

        {/* Item Detail Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isItemModalVisible}
          onRequestClose={() => setIsItemModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsItemModalVisible(false)}
          >
            <View style={styles.itemModalContent}>
              {selectedItem && (
                <>
                  <Image
                    source={{ uri: selectedItem.itemUrl }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalItemTitle}>
                    {selectedItem.itemName}
                  </Text>
                  <Text style={styles.modalItemCategory}>
                    Category: {selectedItem.itemCategory}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.favoriteButton,
                      selectedItem.isFavorite && styles.favoriteButtonActive,
                    ]}
                    onPress={() => handleFavoriteToggle(selectedItem.id)}
                  >
                    <Ionicons
                      name={selectedItem.isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={selectedItem.isFavorite ? "#ff6b6b" : "#685858"}
                    />
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        selectedItem.isFavorite &&
                          styles.favoriteButtonTextActive,
                      ]}
                    >
                      {selectedItem.isFavorite
                        ? "Favorited"
                        : "Add to Favorites"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Add Item Modal */}
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
            <View
              style={styles.addModalContent}
              onStartShouldSetResponder={(e) => e.stopPropagation()}
            >
              <TextInput
                style={styles.modalInput}
                placeholder="Item Name"
                value={newItemData.item_name}
                onChangeText={(text) =>
                  setNewItemData({ ...newItemData, item_name: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Category"
                value={newItemData.item_category}
                onChangeText={(text) =>
                  setNewItemData({ ...newItemData, item_category: text })
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Image URL"
                value={newItemData.item_url}
                onChangeText={(text) =>
                  setNewItemData({ ...newItemData, item_url: text })
                }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#524242",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#524242",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#685858",
  },
  favoriteButtonActive: {
    backgroundColor: "#ffffff15",
    borderColor: "#ff6b6b",
  },
  favoriteButtonText: {
    color: "#BCABAB",
    fontFamily: "Montaga",
    fontSize: 16,
    marginLeft: 8,
  },
  favoriteButtonTextActive: {
    color: "#ff6b6b",
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  favoriteIconContainerActive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
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
    paddingRight: 20,
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
    marginTop: 20,
  },
  categoriesContainer: {
    width: 100,
    backgroundColor: "#373030",
    borderRadius: 15,
    paddingVertical: 20,
    marginRight: 20,
    alignSelf: "flex-start",
  },
  categoryButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  selectedCategory: {
    backgroundColor: "#524242",
  },
  scrollContainer: {
    paddingRight: 40,
  },
  gridContainer: {
    flex: 1,
    paddingRight: 20,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 20,
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
    fontFamily: "Montaga",
  },
  imageBackground: {
    width: 200,
    height: 300,
    backgroundColor: "#685858",
    borderRadius: 25,
    marginRight: 20,
    overflow: "hidden", // This ensures the image stays within bounds
    position: "relative", // For positioning the title overlay
  },
  itemImage: {
    width: "100%",
    height: "100%", // Changed from 80% to 100%
    resizeMode: "cover", // This will ensure the image covers the whole area
  },
  itemTitleContainer: {
    position: "absolute", // Position it over the image
    bottom: 0, // Align to bottom
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 48, 48, 0.8)",
    padding: 10,
  },
  categoryText: {
    fontFamily: "Montaga",
    fontSize: 16,
    color: "#BCABAB",
    textAlign: "center",
  },
  userControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  loadingText: {
    color: "#BCABAB",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Montaga",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Montaga",
  },
  modalInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    fontFamily: "Montaga",
  },
  itemModalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -200 }, { translateY: -200 }],
    backgroundColor: "#373030",
    borderRadius: 15,
    padding: 20,
    width: 400,
    maxHeight: "80%",
  },
  addModalContent: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: [{ translateX: -150 }],
    backgroundColor: "#373030",
    borderRadius: 15,
    padding: 20,
    width: 300,
  },
  userModalContent: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "#373030",
    borderRadius: 15,
    padding: 10,
    minWidth: 150,
  },
  userModalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  addItemButton: {
    backgroundColor: "#524242",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addItemButtonText: {
    color: "#BCABAB",
    fontFamily: "Montaga",
    fontSize: 16,
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalItemTitle: {
    color: "#BCABAB",
    fontFamily: "Montaga",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  modalItemCategory: {
    color: "#BCABAB",
    fontFamily: "Montaga",
    fontSize: 18,
    textAlign: "center",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#524242",
    borderRadius: 8,
  },
  favoriteButtonText: {
    color: "#BCABAB",
    fontFamily: "Montaga",
    fontSize: 16,
    marginLeft: 8,
  },
  favoriteIcon: {
    marginLeft: 5,
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  userModalText: {
    fontFamily: "Montaga",
    color: "#BCABAB",
    fontSize: 16,
  },
  userButton: {
    padding: 5,
  },
  addButton: {
    padding: 5,
  },
  clearButton: {
    padding: 8,
  },
});

export default Index;
