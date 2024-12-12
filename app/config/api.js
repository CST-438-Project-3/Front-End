import axios from 'axios';

// Define base URL for your backend
const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://pantrypal15-1175d47ce25d.herokuapp.com/'
        : 'http://localhost:8080/', // remember to deployed URL in production
    withCredentials: true,
});

// User-related endpoints
export const registerUser = (username, password) =>
    API.post('/api/auth/register', { username, password });

export const loginUser = (username, password) =>
    API.post('/api/auth/login', { username, password });

export const fetchUserProfile = () => API.get('/api/auth/oauth2-success');

// Pantry-related endpoints
export const endpoints = {
    getAllPantries: '/item',
    getPantryById: (id) => `/item/${id}`,
    createPantry: '/item',
    updatePantry: (id) => `/item/${id}`,
    deletePantry: (id) => `/item/${id}`,
};
