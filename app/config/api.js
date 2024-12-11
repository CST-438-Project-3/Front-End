// app/config/api.js
export const API_URL = 'http://localhost:8080/item';  

export const endpoints = {
    getAllPantries: `${API_URL}`,
    getPantryById: (id) => `${API_URL}/${id}`,
    createPantry: API_URL,
    updatePantry: (id) => `${API_URL}/${id}`,
    deletePantry: (id) => `${API_URL}/${id}`
};