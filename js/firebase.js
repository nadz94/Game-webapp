// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIcnPtUiutzf7dfy1kKaDg06CuaZBgnoI",
    authDomain: "pixel-hajj.firebaseapp.com",
    projectId: "pixel-hajj",
    storageBucket: "pixel-hajj.firebasestorage.app",
    messagingSenderId: "646555868440",
    appId: "1:646555868440:web:e039b371bdb27dac07926d",
    measurementId: "G-6F72QMYCTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase initialized");
