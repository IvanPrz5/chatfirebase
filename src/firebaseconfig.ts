// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3WtkPSm0iYDePH_vUi4Bi5TI4ryc3RyE",
  authDomain: "appfirebase-3e9cd.firebaseapp.com",
  projectId: "appfirebase-3e9cd",
  storageBucket: "appfirebase-3e9cd.appspot.com",
  messagingSenderId: "646520854858",
  appId: "1:646520854858:web:5d4d31acc5a266886b09b3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { database, auth }
