// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvvxt7slK3wRe_7jkS5De4w9fwpH3dWoY",
    authDomain: "teste-8fe88.firebaseapp.com",
    projectId: "teste-8fe88",
    storageBucket: "teste-8fe88.appspot.com",
    messagingSenderId: "529651759333",
    appId: "1:529651759333:web:da6ee4c0e5d3073e557c0c"
  };
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Inicializa o Firestore
const db = getFirestore(app);
export { db };