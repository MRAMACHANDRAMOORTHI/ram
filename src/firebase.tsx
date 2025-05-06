// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtV_PFEQZ4PAkELwJAOXQhbbtB23Q6YbU",
  authDomain: "portfolio-41496.firebaseapp.com",
  projectId: "portfolio-41496",
  storageBucket: "portfolio-41496.firebasestorage.app",
  messagingSenderId: "259651149662",
  appId: "1:259651149662:web:b65828349450549d12f9cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
