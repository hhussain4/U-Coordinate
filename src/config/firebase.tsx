// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmc8zyYEK6V_G3es81jSYWA0MHVdQ3hU4",
  authDomain: "u-coordinate.firebaseapp.com",
  projectId: "u-coordinate",
  storageBucket: "u-coordinate.appspot.com",
  messagingSenderId: "343946497947",
  appId: "1:343946497947:web:de45272277102d93dc1b3e",
  measurementId: "G-R8TCY4WCYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
