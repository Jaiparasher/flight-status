import io from 'socket.io-client';
import { requestPermission } from './firebaseService';

// API URL where your WebSocket server is running
const SOCKET_URL = 'http://localhost:8001';

let socket = null;
const flightStatusMap = new Map(); // To store the last status of each flight

// Initialize WebSocket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    // Event listener for WebSocket connection
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    // Event listener for WebSocket disconnection
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Event listener for flight updates
    socket.on('flight_update', (flightUpdate) => {
      console.log('Flight update received:', flightUpdate);
      handleFlightUpdate(flightUpdate);
    });

    // Request notification permission when socket initializes
    requestPermission().then((token) => {
      console.log('FCM Token:', token);
    }).catch((error) => {
      console.error('Error getting FCM token:', error);
    });
  }
};

// Handle flight updates and show notifications
const handleFlightUpdate = (flightUpdate) => {
  const { flight_number, status } = flightUpdate;

  // Check if the flight status has changed
  const previousStatus = flightStatusMap.get(flight_number);

  if (previousStatus !== status) {
    const notificationOptions = {
      body: `Flight ${flight_number} is now ${status}.`,
      icon: '/firebase-logo.png',
    };

    // Display notification using Firebase
    if (Notification.permission === 'granted') {
      new Notification('Flight Status Update', notificationOptions);
    } else {
      console.log('Notification permission not granted');
    }

    // Update the status in the map
    flightStatusMap.set(flight_number, status);
  }
};

// Disconnect WebSocket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
