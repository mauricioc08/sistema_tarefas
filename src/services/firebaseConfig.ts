import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDWqL5H-IkvAmb9aLx3Wt5iFA3Pn7p6V8M",
    authDomain: "sistema-lista-de-tarefas.firebaseapp.com",
    projectId: "sistema-lista-de-tarefas",
    storageBucket: "sistema-lista-de-tarefas.appspot.com",
    messagingSenderId: "295743173908",
    appId: "1:295743173908:web:0ba12623a9bd5650747e01"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };




