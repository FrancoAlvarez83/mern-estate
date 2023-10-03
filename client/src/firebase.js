// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-56b3f.firebaseapp.com",
  projectId: "mern-estate-56b3f",
  storageBucket: "mern-estate-56b3f.appspot.com",
  messagingSenderId: "356769797152",
  appId: "1:356769797152:web:967e91cac0eb88d7f75845"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);