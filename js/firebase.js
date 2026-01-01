// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1qbLxq_XVfMDOeOetBvyAsM4ePwao7rQ",
    authDomain: "bit-hajj.firebaseapp.com",
    projectId: "bit-hajj",
    storageBucket: "bit-hajj.firebasestorage.app",
    messagingSenderId: "350092156846",
    appId: "1:350092156846:web:811453f1d792bf99c9f23f",
    measurementId: "G-B8T46E3G65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase initialized");
