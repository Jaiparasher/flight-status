import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
