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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isMobile = width < 600;



const Restock = () => {
  const [fontsLoaded] = useFonts({
    Montaga: require("../../assets/fonts/Montaga-Regular.ttf"),
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lowItems, setLowItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [userId, setUserId] = useState(null);


  if (!fontsLoaded) return null;

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

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
    const fetchLowItems = async (userId) => {
      try {
        const response = await fetch(
          `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const lowItems = data.filter((item) => item.quantity <= 4);
        console.log("Low items:", lowItems);
        return lowItems;
      } catch (error) {
        console.error("Detailed error:", error);
        return [];
      }
    };

    const fetchLowItemDetails = async (lowItems) => {
      console.log("Fetching details:");
      const updatedLowItems = await Promise.all(
        lowItems.map(async (item) => {
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
              quantity: item.quantity,
            };
          } catch (error) {
            console.error("Detailed error:", error);
            return item;
          }
        })
      );
      setLowItems(updatedLowItems);
      setFilteredItems(updatedLowItems);

      const categories = updatedLowItems.map((item) => item.category);
      const uniqueCategories = [...new Set(categories)];
      setCategories(uniqueCategories);
    };

    const loadItems = async () => {
      const userId = await fetchUserId();
      const lowItems = await fetchLowItems(userId);
      await fetchLowItemDetails(lowItems);
    }

    loadItems();
  }, []);

  // Add category filter function
  const handleCategoryFilter = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredItems(lowItems);
    } else {
      setSelectedCategory(category);
      const filtered = lowItems.filter((item) => item.category === category);
      setFilteredItems(filtered);
    }
  };

  const handleAddQuantity = async (itemId) => {
    try {
      const currentItem = lowItems.find((item) => item.id === itemId);
      if (!currentItem) {
        throw new Error("Item not found in state.");
      }
  
      // Increment the quantity
      const updatedQuantity = currentItem.quantity + 1;
  
      // Send the updated quantity to the server
      const updateResponse = await fetch(
        `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ quantity: updatedQuantity }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      console.log("Updated item:", updatedQuantity);
  
      const updatedItem = await updateResponse.json();
  
      // Update the state with the new quantity
      setLowItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (error) {
      console.error("Error adding quantity:", error);
      // Optionally, show user feedback
      alert("Failed to update item quantity. Please try again.");
    }
  };

  const handleSubtractQuantity = async (itemId) => {
    try {
      const currentItem = lowItems.find((item) => item.id === itemId);
      if (!currentItem) {
        throw new Error("Item not found in state.");
      }
  
      // Increment the quantity
      if (currentItem.quantity === 0) {
        return;
      }
      const updatedQuantity = currentItem.quantity - 1;
  
      // Send the updated quantity to the server
      const updateResponse = await fetch(
        `https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ quantity: updatedQuantity }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }
  
      const updatedItem = await updateResponse.json();
  
      // Update the state with the new quantity
      setLowItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (error) {
      console.error("Error adding quantity:", error);
      // Optionally, show user feedback
      alert("Failed to update item quantity. Please try again.");
    }
  };

  

  const handleFavoriteToggle = async (itemId) => {
    try {
      const currentItem = lowItems.find((item) => item.id === itemId);
      if (!currentItem) {
        throw new Error("Item not found in state.");
      }

      console.log("Current item:", currentItem);
      const updatedFavorite = !currentItem.isFavorite;
      console.log("Updated favorite:", updatedFavorite);

      const response = await fetch(`https://pantrypal15-1175d47ce25d.herokuapp.com/userItems/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: updatedFavorite }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedItem = await response.json();
      setLowItems((prevItems) => prevItems.map((item) => item.id === itemId ? { ...item, isFavorite: updatedItem.favorite } : item));
      setFilteredItems((prevItems) => prevItems.map((item) => item.id === itemId ? { ...item, isFavorite: updatedItem.favorite } : item));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to toggle favorite status. Please try again.");
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
            
            <View style={styles.quantityControls}>
              <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleSubtractQuantity(item.id)}
              >
                  <Ionicons name="remove" size={24} color="#BCABAB" />
              </TouchableOpacity>
              <Text style={styles.modalDetails}>Quantity: {item?.quantity}</Text>
              <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleAddQuantity(item.id)}
              >
                  <Ionicons name="add" size={24} color="#BCABAB" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
                    style={[
                      styles.favoriteButton,
                      selectedItem?.isFavorite && styles.favoriteButtonActive,
                    ]}
                    onPress={() => handleFavoriteToggle(selectedItem.id)}
                  >
                    <Ionicons
                      name={selectedItem?.isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={selectedItem?.isFavorite ? "#ff6b6b" : "#685858"}
                    />
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        selectedItem?.isFavorite &&
                          styles.favoriteButtonTextActive,
                      ]}
                    >
                      {selectedItem?.isFavorite
                        ? "Favorited"
                        : "Add to Favorites"}
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

              <Text style={styles.navText}>restock</Text>

              <Link href="/favorites" style={styles.navText}>
                favorites
              </Link>
            </View>
          </View>

          {/* Username */}
          <View style={styles.titleRow}>
            <Text style={styles.username}>Low Items</Text>
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
              placeholder="Search low items..."
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
                      <Text style={styles.quantityText}>{item?.quantity}</Text>
                      <TouchableOpacity
                        style={[
                          styles.favoriteIconContainer,
                          item.isFavorite && styles.favoriteIconContainerActive,
                        ]}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(item.id);
                        }}
                      >
                        <Ionicons
                          name={item.isFavorite ? "heart" : "heart-outline"}
                          size={24}
                          color={item.isFavorite ? "#ff6b6b" : "#685858"}
                        />
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
                      <Text style={styles.quantityText}>{item?.quantity}</Text>
                      <TouchableOpacity
                          style={[
                            styles.favoriteIconContainer,
                            item.isFavorite && styles.favoriteIconContainerActive,
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(item.id);
                          }}
                        >
                          <Ionicons
                            name={item.isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={item.isFavorite ? "#ff6b6b" : "#685858"}
                          />
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
  quantityText: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontFamily: "Montaga",
    fontSize: 18,
    color: "#ffffff",
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
      marginHorizontal: 10,
  },
  favoriteButtonTextActive: {
    color: "#ff6b6b",
  },
  favoriteIconContainerActive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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
  favoriteButtonActive: {
    backgroundColor: "#ffffff15",
    borderColor: "#ff6b6b",
  },
});

export default Restock;