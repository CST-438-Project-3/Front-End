// hooks/usePantry.js
const BASE_URL = 'https://pantrypal15-1175d47ce25d.herokuapp.com';

export const usePantry = () => {
    const fetchItems = async () => {
        try {
            console.log('Starting fetch from:', `${BASE_URL}/items`);
            const response = await fetch(`${BASE_URL}/items`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Successfully fetched data:', data);
            return data;
        } catch (error) {
            console.error('Detailed error:', error);
            return [];
        }
    };

    const addItem = async (itemData) => {
        try {
            const response = await fetch(`${BASE_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemName: itemData.item_name,
                    itemCategory: itemData.item_category
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    };

    return { fetchItems, addItem };
};