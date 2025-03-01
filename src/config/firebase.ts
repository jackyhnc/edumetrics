import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC8RNc-gR1CzQl3llPpLcWxHtXt4kz6vO4",
    authDomain: "edu-metrics-713ec.firebaseapp.com",
    projectId: "edu-metrics-713ec",
    storageBucket: "edu-metrics-713ec.firebasestorage.app",
    messagingSenderId: "392287801636",
    appId: "1:392287801636:web:41d3168278df6cf6bbe3b1",
    measurementId: "G-5XWSEVEC5S",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);