import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, setDoc, getDocs, doc, updateDoc  } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser ,
  GoogleAuthProvider,
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAs53lxwaD6wZuLqXcpzF-G_yE-E40Funk",
  authDomain: "feedart-3bdc9.firebaseapp.com",
  projectId: "feedart-3bdc9",
  storageBucket: "feedart-3bdc9.appspot.com",
  messagingSenderId: "212002898293",
  appId: "1:212002898293:web:9a125c79ee22175ac9533c",
  measurementId: "G-75G6FY3WNZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firestore
const db = getFirestore();

// USERS
export async function guardarUser(email, img_url, nombre, uid) {
  try {
    const docRef = await setDoc(doc(db, "users", uid), {
      email: email,
      img_url: img_url,
      nombre: nombre,
      uid: uid,
    });
    console.log(docRef)
    
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function actualizarUser(uid,img_url,nombre){
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        "img_url": img_url,
        "nombre" : nombre
    });
}

export async function obtenerUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

export async function guardarUserConGoogle(user) {
  const querySnapshot = await getDocs(collection(db, "users"));
  if (!querySnapshot.docs.includes(user.uid)){
    guardarUser(user.email, user.photoURL, user.displayName, user.uid)
    console.log("Guardado")
  }
}

// Firebase Auth

//const user = auth.currentUser; OBTIENE AL USUARIO QUE ACCEDIO Y ES NULO SI NO HAY

const auth = getAuth();

export async function logUpConMail(email, password, img_url, nombre) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      guardarUser(email, img_url, nombre, user.uid);
      const save = {
        uid: user.uid,
        email: user.email,
        photoURL: img_url,
        displayName: nombre
      }
      saveStorage(save)
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

export async function logInConGoogle(){
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    const save = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName
    }
    saveStorage(save)
    guardarUserConGoogle(user)
  }).catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage)
  });
}

export async function recuperarUser(user) {
  const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.id === user.uid){
          const save = {
            uid: user.uid,
            email: user.email,
            photoURL: doc.data().img_url,
            displayName: doc.data().nombre
          }
          saveStorage(save)
        }
      });
}

export async function logInConMail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const save = {
        uid: user.uid,
        email: user.email,
        photoURL: "",
        displayName: ""
      }
      saveStorage(save)
      recuperarUser(user)
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

export async function obtenerUsuario() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid)
    } else {
      // User is signed out
      // ...
    }
  });
}

export async function obtenerPerfil(){
    const user = auth.currentUser;
    if (user !== null) {
    return user
  }
}

export async function actualizarPerfil(nombre,img_url){
    updateProfile(auth.currentUser, {
        displayName: nombre, photoURL: img_url
      }).then(() => {
        actualizarUser(auth.currentUser.uid,img_url,nombre)
      }).catch((error) => {
        // An error occurred
        // ...
      });
}

export async function borrarUser(){
    const user = auth.currentUser;

    deleteUser(user).then(() => {
    // User deleted.
    }).catch((error) => {
    // An error ocurred
    // ...
    });
}


// storage

const storage = getStorage(app);

export function saveStorage(storage){
  localStorage.storage = JSON.stringify(storage)
}

export function restoreSessionAction() {
  let storage = localStorage.getItem('storage')
  storage = JSON.stringify(storage)
  if (storage){
      return storage
  }
}

export function logOut(){
  signOut(auth).then(() => {
    localStorage.removeItem('storage');
  }).catch((error) => {
    // An error happened.
  });
  console.log(auth.currentUser)
}


export { analytics, auth, storage };
