import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvXT40uOURyUUE8PfgnZPXu9bBUjTO_oA",
  authDomain: "interviewai-dec92.firebaseapp.com",
  projectId: "interviewai-dec92",
  storageBucket: "interviewai-dec92.firebasestorage.app",
  messagingSenderId: "261414524228",
  appId: "1:261414524228:web:c4526ff8d501a76c7bf311",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);