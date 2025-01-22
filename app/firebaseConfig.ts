// firebaseConfig.js
import { initializeApp } from "firebase/app"; // Pastikan ini adalah import yang benar
import { getAuth } from "firebase/auth"; // Pastikan auth juga diimpor

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyB3Kz07wnEfBM98lqaFF2q43EXJGjHzDPw",
  authDomain: "todoapp-9fde9.firebaseapp.com",
  projectId: "todoapp-9fde9",
  storageBucket: "todoapp-9fde9.firebasestorage.app",
  messagingSenderId: "510640707841",
  appId: "1:510640707841:web:3c69ad1620978ba41fe300"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig); // Ini yang penting, pastikan inisialisasi dilakukan dengan benar

// Mengakses Auth
const auth = getAuth(app); // Pastikan menggunakan app yang sudah diinisialisasi

export { auth }; // Ekspor auth yang sudah diinisialisasi
