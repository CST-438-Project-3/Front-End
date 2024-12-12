import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const isMobile = width < 600;

const userId = "1"; 

const Favorites = () => {
  const [fontsLoaded] = useFonts({
    Montaga: require("../../assets/fonts/Montaga-Regular.ttf"),
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  if (!fontsLoaded) return null;

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchFavoriteItems = async () => {
        try {
            const response = await fetch(
                `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/user/${userId}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const favorites = data.filter((item) => item.isFavorite);
            console.log("Favorites:", favorites);
            return favorites;
        } catch (error) {
            console.error("Detailed error:", error);
            return [];
        }
    };

    const fetchFavoriteDetails = async (favorites) => {
        console.log("Fetching details:");
        const updatedFavorites = await Promise.all(
            favorites.map(async (item) => {
                try {
                    const response = await fetch(
                        `https://pantrypal15-1175d47ce25d.herokuapp.com/items/${item.itemId}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Item:", data);
                    return {
                        ...item,
                        src: data.itemUrl,
                        title: data.itemName,
                        category: data.itemCategory,
                        is_favorite: true,
                    };
                } catch (error) {
                    console.error("Detailed error:", error);
                    return item;
                }
            })
        );
        setFavoriteItems(updatedFavorites);
        setFilteredItems(updatedFavorites);

        const categories = updatedFavorites.map((item) => item.category);
        const uniqueCategories = [...new Set(categories)];
        setCategories(uniqueCategories);
    };

    // Execute functions
    const loadFavorites = async () => {
        const favorites = await fetchFavoriteItems();
        await fetchFavoriteDetails(favorites);
    };

    loadFavorites();
}, []); 

  // Category filter function
  const handleCategoryFilter = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredItems(favoriteItems);
    } else {
      setSelectedCategory(category);
      const filtered = favoriteItems.filter(
        (item) => item.category === category
      );
      setFilteredItems(filtered);
    }
  };
  const handleFavoriteToggle = async (itemId) => {
    try {
      const response = await fetch(
        `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_favorite: false, // We're always unfavoriting in this view
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      // Remove the item from the favorites list
      const updatedItems = favoriteItems.filter(
        (item) => item.itemId !== itemId
      );
      setFavoriteItems(updatedItems);
      setFilteredItems(
        selectedCategory
          ? updatedItems.filter((item) => item.category === selectedCategory)
          : updatedItems
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  const ItemModal = ({ item, visible, onClose }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#BCABAB" />
          </TouchableOpacity>
          <Image source={{ uri: item?.src }} style={styles.modalImage} />
          <View style={styles.modalInfo}>
            <Text style={styles.modalTitle}>{item?.title}</Text>
            <Text style={styles.modalDetails}>Category: {item?.category}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleFavoriteToggle(item?.itemId)}
            >
              <Ionicons name="heart" size={24} color="#ff6b6b" />
              <Text style={styles.favoriteButtonText}>
                Remove from Favorites
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
                <Text>my pantry</Text>
              </Link>
              <Link href="/recipe" style={styles.navText}>
                <Text>recipes</Text>
              </Link>
              <Link href="/restock" style={styles.navText}>
                <Text>restock</Text>
              </Link>
              <Text style={styles.navText}>favorites</Text>
            </View>
          </View>

          {/* Username */}
          <View style={styles.titleRow}>
            <Text style={styles.username}>Favorites</Text>
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
              placeholder="Search favorites..."
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
                  selectedCategory === category && styles.selectedCategory,
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
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                {filteredItems
                  .slice(0, Math.ceil(filteredItems.length / 2))
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageBackground}
                      onPress={() => openModal(item)}
                    >
                      <Image source={{ uri: item?.src }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.favoriteIconContainer}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(item.itemId);
                        }}
                      >
                        <Ionicons name="heart" size={24} color="#ff6b6b" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.gridRow}>
                {filteredItems
                  .slice(Math.ceil(filteredItems.length / 2))
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageBackground}
                      onPress={() => openModal(item)}
                    >
                      <Image source={{ uri: item?.src }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.favoriteIconContainer}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(item.itemId);
                        }}
                      >
                        <Ionicons name="heart" size={24} color="#ff6b6b" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </ScrollView>
        </View>
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
  categoryText: {
    fontFamily: "Montaga",
    fontSize: 16,
    color: "#BCABAB",
    textAlign: "center",
  },
  selectedCategory: {
    backgroundColor: "#524242",
  },
  scrollContainer: {
    paddingRight: 40,
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
  gridContainer: {
    marginRight: 40,
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageBackground: {
    width: 200,
    height: 230,
    backgroundColor: "#685858",
    borderRadius: 25,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalInfo: {
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Montaga",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 10,
  },
  modalDetails: {
    fontFamily: "Montaga",
    fontSize: 18,
    color: "#BCABAB",
    marginBottom: 5,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
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
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#524242",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  favoriteButtonText: {
    color: "#ff6b6b",
    fontFamily: "Montaga",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Favorites;
