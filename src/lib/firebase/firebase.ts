// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF5TGSYK7kwkjiWGXXC9H7phEBusd24Kc",
  authDomain: "sip-wise.firebaseapp.com",
  projectId: "sip-wise",
  storageBucket: "sip-wise.appspot.com",
  messagingSenderId: "178266752989",
  appId: "1:178266752989:web:576ccf2d20f81837279834"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };