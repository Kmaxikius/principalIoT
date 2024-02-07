// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAy3Gj9OuzWe3MGc1yfOZ5STEVc-OXmSgs",

    authDomain: "iotjs-30-01-24.firebaseapp.com",

    projectId: "iotjs-30-01-24",

    storageBucket: "iotjs-30-01-24.appspot.com",

    messagingSenderId: "937073009493",

    appId: "1:937073009493:web:c71df201b378f901e345dc",
    
    measurementId: "G-7MGJKQNBRT"
  };

//Conectamos con la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore()

//CRUD

export const saveData = (ref,objeto) => addDoc(collection(db,ref),objeto)
export const getDataCollection = (ref) => getDocs(collection(db,ref))
export const getDataChanged_collection = ( ref, callBack) => onSnapshot(collection(db,ref),callBack)
export const getDataChanged_document = (ref, document, callBack) => onSnapshot(doc(db,ref, document),callBack)
export const deleteData = (id, ref) => deleteDoc(doc(db,ref,id))
export const getData = (id, ref) => getDoc(doc(db,ref,id))
export const updateData = (id, ref, objeto) => updateDoc(doc(db, ref, id), objeto) 

// Cambiar el nombre de un documento en Firestore
export const cambiarNombreDocumento = async (ref, id, nuevoNombre) => {
    try {
        await updateDoc(doc(db, ref, id), {
            nombre: nuevoNombre
        });
        console.log("Nombre del documento actualizado correctamente.");
    } catch (error) {
        console.error("Error al cambiar nombre del documento:", error);
    }
}