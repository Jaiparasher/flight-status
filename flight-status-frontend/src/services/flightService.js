import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8000';

// Fetch flight details
export const getFlights = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/flights`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Failed to fetch flights');
  }
};
