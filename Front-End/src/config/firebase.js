import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkGNYYdm565tXDcSlVi8t1thdi9tTl69w",
  authDomain: "smart-recruitment-platform.firebaseapp.com",
  projectId: "smart-recruitment-platform",
  storageBucket: "smart-recruitment-platform.appspot.com",
  messagingSenderId: "759727220308",
  appId: "1:759727220308:web:3e7e51a8cbbb502ae5efc1"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);