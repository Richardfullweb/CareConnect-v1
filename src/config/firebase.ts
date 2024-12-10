import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBEJt_Z8mggU_ckUCpQjK3-3ArlrBmvPHc",
  authDomain: "ambiente-python-431822.firebaseapp.com",
  projectId: "ambiente-python-431822",
  storageBucket: "ambiente-python-431822.firebasestorage.app",
  messagingSenderId: "952921538910",
  appId: "1:952921538910:web:e3080bad1df2dc94e80fcf",
  measurementId: "G-8TV19DH24E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
