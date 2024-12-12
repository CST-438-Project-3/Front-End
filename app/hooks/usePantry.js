const API_URL = 'https://pantrypal15-1175d47ce25d.herokuapp.com';

export const usePantry = () => {
    const fetchItems = async () => {
        try {
            console.log('Fetching items...');
            const response = await fetch(`${API_URL}/items`);
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
   
            const data = await response.json();
            console.log('API Response:', data);
            
            const itemsWithDefaults = data.map(item => ({
                ...item,
                isFavorite: item.is_favorite === null ? false : item.is_favorite,
                itemQuantity: item.item_quantity === null ? 0 : item.item_quantity
            }));
   
            console.log('Fetched items:', itemsWithDefaults);
            return itemsWithDefaults;
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    };
   

    // Adding item
    const addItem = async (itemData) => {
        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemName: itemData.item_name,
                    itemCategory: itemData.item_category,
                    itemUrl: itemData.item_url,
                    is_favorite: itemData.isFavorite,   
                    item_quantity: itemData.itemQuantity 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newItem = await response.json();
            console.log('New item added:', newItem);
            return newItem;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    };

    // Toggling favorite status
    const toggleFavorite = async (itemId) => {
        try {
            // get current item
            const itemResponse = await fetch(`${API_URL}/items/${itemId}`);
            const currentItem = await itemResponse.json();
            
            // toggling favorite status
            const response = await fetch(`${API_URL}/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isFavorite: !currentItem.isFavorite
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const updatedItem = await response.json();
            console.log('Updated item:', updatedItem);
            return updatedItem;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    };

    return { fetchItems, addItem, toggleFavorite };
};
