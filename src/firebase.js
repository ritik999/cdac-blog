// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// VITE_FIREBASE_API_KEY="AIzaSyCEVq2sUR0hfz28TeJAHL1KAvc9oj7g8mk"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cdac-blo.firebaseapp.com",
  projectId: "cdac-blo",
  storageBucket: "cdac-blo.appspot.com",
  messagingSenderId: "488660774405",
  appId: "1:488660774405:web:e10127bb0435339527f66c",
  measurementId: "G-47QTYFL5Y2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);