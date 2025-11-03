// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA8BN1ZygZXb0WvX7GYXsASIOeM2QkaHfo",
    authDomain: "ai-interviewer-65a56.firebaseapp.com",
    projectId: "ai-interviewer-65a56",
    storageBucket: "ai-interviewer-65a56.firebasestorage.app",
    messagingSenderId: "299260791601",
    appId: "1:299260791601:web:01ece204ef206c8a4b3e10",
    measurementId: "G-FBWNJ3SXGJ",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
