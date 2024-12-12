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
    };

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
          item.id === itemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
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
          item.id === itemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error adding quantity:", error);
      // Optionally, show user feedback
      alert("Failed to update item quantity. Please try again.");
    }
  };

  const ItemModal = ({ item, visible, onClose }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose} // This will close the modal when clicking the overlay
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()} // This prevents closing when clicking the content
        >
          <View style={styles.modalImageContainer}>
            <Image source={{ uri: item?.src }} style={styles.modalImage} />
          </View>

          <Text style={styles.modalTitle}>{item?.title}</Text>
          <Text style={styles.modalCategory}>Category: {item?.category}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleSubtractQuantity(item.id)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.modalQuantity}>Quantity: {item?.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleAddQuantity(item.id)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridContainer}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageBackground}
                  onPress={() => openModal(item)}
                >
                  <Image source={{ uri: item?.src }} style={styles.image} />
                  <Text style={styles.quantityText}>{item?.quantity}</Text>
                </TouchableOpacity>
              ))}
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
  categoryText: {
    fontFamily: "Montaga",
    fontSize: 16,
    color: "#BCABAB",
    textAlign: "center",
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
  scrollContainer: {
    flexGrow: 1,
    paddingRight: 40,
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  imageBackground: {
    width: 200,
    height: 300,
    backgroundColor: "#685858",
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  quantityText: {
    position: "absolute",
    bottom: 15,
    right: 15,
    fontFamily: "Montaga",
    fontSize: 18,
    color: "#ffffff",
    backgroundColor: "rgba(55, 48, 48, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#373030",
    borderRadius: 25,
    padding: 20,
    width: 400,
    alignItems: "center",
  },
  modalImageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalTitle: {
    fontFamily: "Montaga",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  modalCategory: {
    fontFamily: "Montaga",
    fontSize: 18,
    color: "#BCABAB",
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  quantityButton: {
    backgroundColor: "#524242",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#BCABAB",
    fontSize: 24,
    fontFamily: "Montaga",
  },
  modalQuantity: {
    fontFamily: "Montaga",
    fontSize: 18,
    color: "#BCABAB",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#524242",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
});

export default Restock;