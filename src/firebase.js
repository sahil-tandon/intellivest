import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBNkI3CiOnUL5Jpc3yXx1BTdBrKRiOoeOw",
  authDomain: "intellivest-app.firebaseapp.com",
  projectId: "intellivest-app",
  storageBucket: "intellivest-app.appspot.com",
  messagingSenderId: "928683841722",
  appId: "1:928683841722:web:c87aa2771e99e998dd8a83",
  measurementId: "G-E0YD2RX5CS",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
