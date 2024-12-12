import axios from 'axios';

// Define base URL for your backend
const API = axios.create({
    baseURL: 'https://pantrypal15-1175d47ce25d.herokuapp.com/', // Change to deployed URL in production
    withCredentials: true, // Enable cookies if using sessions
});

// Register a user
export const registerUser = (username, password) =>
    API.post('/api/auth/register', { username, password });

// Login a user
export const loginUser = (username, password) =>
    API.post('/api/auth/login', { username, password });

// Fetch user profile (for OAuth2 success)
export const fetchUserProfile = () => API.get('/api/auth/oauth2-success');
