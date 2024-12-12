export const usePantry = () => {
  const API_URL = "https://pantrypal15-1175d47ce25d.herokuapp.com";

  const fetchItems = async () => {
    try {
      console.log("Fetching items and user favorites...");

      // get all items
      const itemsResponse = await fetch(`${API_URL}/items`);
      const items = await itemsResponse.json();

      // user can check fav
      const userItemsResponse = await fetch(
        `${API_URL}/userItems/user/${userId}`
      );
      const userItems = await userItemsResponse.json();

      // fav -> items
      const itemsWithFavorites = items.map((item) => {
        const userItem = userItems.find((ui) => ui.itemId === item.id);
        return {
          ...item,
          is_favorite: userItem ? userItem.is_favorite : false,
          itemQuantity: item.item_quantity === null ? 0 : item.item_quantity,
        };
      });

      console.log("Items with favorites:", itemsWithFavorites);
      return itemsWithFavorites;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  const toggleFavorite = async (itemId, newStatus) => {
    try {
      // userItem if exists
      const userItemsResponse = await fetch(
        `${API_URL}/userItems/user/${userId}`
      );
      const userItems = await userItemsResponse.json();
      const existingUserItem = userItems.find((ui) => ui.itemId === itemId);

      let response;

      if (existingUserItem) {
        // Update userItem
        response = await fetch(`${API_URL}/userItems/${existingUserItem.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_favorite: newStatus,
          }),
        });
      } else {
        // Create new userItem
        response = await fetch(`${API_URL}/userItems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            itemId: itemId,
            is_favorite: newStatus,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      throw error;
    }
  };

  const addItem = async (itemData) => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: itemData.item_name,
          itemCategory: itemData.item_category,
          itemUrl: itemData.item_url,
          is_favorite: itemData.isFavorite,
          item_quantity: itemData.itemQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newItem = await response.json();
      console.log("New item added:", newItem);
      return newItem;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  };

  return { fetchItems, addItem, toggleFavorite };
};
