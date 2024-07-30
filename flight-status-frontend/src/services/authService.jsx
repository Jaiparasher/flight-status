import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Register a new user
export const signup = async (fullName, email, password, flightRefId) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      full_name: fullName,
      email,
      password,
      flight_ref_id: flightRefId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Registration failed');
  }
};

// Log in a user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Login failed');
  }
};
export const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Log out a user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get the authentication token from local storage
export const getToken = () => {
  return localStorage.getItem('token');
};
