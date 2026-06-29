import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbLrqA5qBdCN63GdyomYxfTAInNP1jUbk",
    authDomain: "gosafe-transportation.firebaseapp.com",
    projectId: "gosafe-transportation",
    storageBucket: "gosafe-transportation.firebasestorage.app",
    messagingSenderId: "224288111431",
    appId: "1:224288111431:web:dcad4aa3da68a074212a62",
    measurementId: "G-23HXRGLFBZ"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
