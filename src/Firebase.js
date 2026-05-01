// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxcnH_t48GaZzbsNHPKfGqsO9RU2ARfZc",
  authDomain: "teacher-consultation-sys-6519c.firebaseapp.com",
  projectId: "teacher-consultation-sys-6519c",
  storageBucket: "teacher-consultation-sys-6519c.firebasestorage.app",
  messagingSenderId: "935608644778",
  appId: "1:935608644778:web:904a992e329da3bd9a0cd3",
  measurementId: "G-MKHJ33RPLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
const analytics = getAnalytics(app);