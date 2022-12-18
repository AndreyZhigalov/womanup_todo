import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage, ref } from 'firebase/storage';

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCpjxqn7DLcTZNfI9fAOoTTwZ_j1edTg_g',
  authDomain: 'todo-woman-up.firebaseapp.com',
  projectId: 'todo-woman-up',
  storageBucket: 'todo-woman-up.appspot.com',
  messagingSenderId: '768077812323',
  appId: '1:768077812323:web:03f851f74f0bb6fe199e56',
  measurementId: 'G-FCE7FL4YM8',
});

export const DB = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);

export const storageRef = ref(storage);
