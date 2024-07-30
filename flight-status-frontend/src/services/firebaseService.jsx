import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqZ3NtdEfeF-c5QrVcmP7bY2VsEA4ZIkc",
    authDomain: "flight-status-6df58.firebaseapp.com",
    projectId: "flight-status-6df58",
    storageBucket: "flight-status-6df58.appspot.com",
    messagingSenderId: "277352522559",
    appId: "1:277352522559:web:db0240b2fe1162093ba98a",
    measurementId: "G-SLF4ESB6QD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission to send notifications
export const requestPermission = async () => {
 
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  })
}

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage((payload) => {
      console.log('Message received. ', payload);
      const { title, body } = payload.notification;
      const notificationOptions = {
        body,
        icon: '/firebase-logo.png',
      };
      new Notification(title, notificationOptions);
      resolve(payload);
    });
  });
};

// For background message handling, ensure you have a service worker in place
export const setUpBackgroundMessageHandler = () => {
  messaging.setBackgroundMessageHandler((payload) => {
    console.log('Received background message ', payload);
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
      body,
      icon: '/firebase-logo.png',
    });
  });
};
