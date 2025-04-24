// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


    const firebaseConfig = {
        apiKey: "AIzaSyAd3jCEA8G1m9u4SgtmrBU8dk1NI3s0nSo",
        authDomain: "jobportalproject-6d2e0.firebaseapp.com",
        projectId: "jobportalproject-6d2e0",
        storageBucket: "jobportalproject-6d2e0.firebasestorage.app",
        messagingSenderId: "693362138260",
        appId: "1:693362138260:web:208e2f817c8cd654c66881",
        measurementId: "G-KMRWLK3FFP"
      };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };