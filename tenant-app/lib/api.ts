import axios from 'axios';

const API_BASE_URL = 'http://5.161.48.45:8003';

// Create an instance to handle authorization headers (from Supabase)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

