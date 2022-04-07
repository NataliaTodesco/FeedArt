import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { 
  collection, setDoc, getDocs, doc, updateDoc, deleteDoc, where, query, orderBy, addDoc, getDoc
} from "firebase/firestore";
import { 
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  updateProfile, deleteUser, GoogleAuthProvider, signInWithPopup, signOut, 
} from "firebase/auth";

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

// =========================================== GESTION DE USUARIO =========================================== //

export async function guardarUser(email, img_url, nombre, uid,fecha) {
  try {
    const docRef = await setDoc(doc(db, "users", uid), {
      email: email,
      img_url: img_url,
      nombre: nombre,
      uid: uid,
      fecha: fecha
    });
    console.log(docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function actualizarUser(uid, img_url, nombre) {
  const userRef = doc(db, "users", uid);

  return await updateDoc(userRef, {
    img_url: img_url,
    nombre: nombre,
  })
    .then(() => {
      recuperarUser(auth.currentUser)
      return "";
    })
    .catch((e) => {
      return e.errorMessage;
    });
}

export async function obtenerUsers() {
  let users = []

  const usersRef = collection(db, "users");
  
  const q = query(usersRef, orderBy("fecha"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let fec = new Date(doc.data().fecha.toMillis());
    users.push({id: doc.id, Imagen: doc.data().img_url, Nombre: doc.data().nombre, Email: doc.data().email,UID:doc.data().uid, Fecha: fec})
  });

  return users
}

export async function guardarUserConGoogle(user) {
  const querySnapshot = await getDocs(collection(db, "users"));
  if (querySnapshot.docs.indexOf(user.uid) === -1) {
    guardarUser(user.email, user.photoURL, user.displayName, user.uid, new Date(auth.currentUser.metadata.creationTime));
  }
}

// Firebase Auth

const auth = getAuth();

export async function logUpConMail(email, password, img_url, nombre) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      guardarUser(email, img_url, nombre, user.uid, new Date());
      const save = {
        uid: user.uid,
        email: user.email,
        photoURL: img_url,
        displayName: nombre,
      };
      saveStorage(save);
      return "";
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
}

export async function logInConGoogle() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const save = {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
      };
      saveStorage(save);
      guardarUserConGoogle(user);
      return "";
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
}

export async function recuperarUser(user) {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.id === user.uid) {
      const save = {
        uid: user.uid,
        email: user.email,
        photoURL: doc.data().img_url,
        displayName: doc.data().nombre,
      };
      saveStorage(save);
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
        displayName: "",
      };
      saveStorage(save);
      recuperarUser(user);
      return "";
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
}

export async function obtenerUsuario() {
  let fecha = "";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      // User is signed out
      // ...
    }
  });
  return fecha
}

export async function obtenerPerfil() {
  const user = auth.currentUser;
  if (user !== null) {
    return user;
  }
}

export async function actualizarPerfil(nombre, img_url) {
  return await updateProfile(auth.currentUser, {
    displayName: nombre,
    photoURL: img_url,
  })
    .then(() => {
      actualizarUser(auth.currentUser.uid, img_url, nombre).then((res) => {
        if (res === "") return "";
        else return res;
      });
    })
    .catch((error) => {
      return error.errorMessage;
    });
}

export async function borrarUser() {
  const user = auth.currentUser;

  deleteUser(user)
    .then(() => {
      deleteDoc(doc(db, "users", user.uid));
      deleteDoc(doc(db, "favs", user.uid));
      deleteDoc(doc(db, "likes", user.uid));
      eliminarDoc(user.uid);
    })
    .catch((error) => {
      console.log(error.errorMessage);
    });
}

async function eliminarDoc(uid) {
  const projectsRef = collection(db, "projects");

  const q = query(projectsRef, where("uid_creador", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((documento) => {
    deleteDoc(doc(db, "projects", documento.id));
  });
}

// =========================================== STORAGE =========================================== //

const storage = getStorage(app);

export function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage);
}

export function restoreSessionAction() {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  if (storage) {
    return storage;
  }
}

export function logOut() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("storage");
    })
    .catch((error) => {
    });
}


// =========================================== GESTION DE PROYECTO =========================================== //

export async function guardarProyecto(titulo,descripcion,categoria,img_url,tags,precio) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      categoria: categoria,
      comentarios: [],
      descripcion: descripcion,
      favs: 0,
      img_url: img_url,
      likes: 0,
      precio: precio,
      tags: tags,
      titulo: titulo,
      uid_creador: restoreSessionAction().uid,
    });
    console.log(docRef);
    return "";
  } catch (e) {
    console.error("Error adding document: ", e);
    return e
  }
}

export async function consultarProyecto(id){
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {id: docSnap.id, datos: docSnap.data()}
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

export async function obtenerCreador(uid) {
  let respuesta = {};
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.id === uid) {
      let fec = new Date(doc.data().fecha.toMillis()).toLocaleDateString()
      const save = {
        uid: uid,
        email: doc.data().email,
        img_url: doc.data().img_url,
        nombre: doc.data().nombre,
        fecha: fec
      };
      respuesta = save
    }
  });
  return respuesta
}

export function obtenerCategoria(numero){
  if (numero === 1){
    return "Arte Tradicional"
  }
  else if (numero === 2){
    return "Dibujos y Pinturas"
  }
  else if (numero === 3){
    return "Fotografía"
  }
  else if (numero === 4){
    return "Arte digital"
  }
  else if (numero === 5){
    return "3D"
  }
  else if (numero === 6){
    return "Esculturas"
  }
  else {
    return "Arte callejero"
  }

}

export async function proyectosxUID(uid) {
  let proyectos = [];
  const projectsRef = collection(db, "projects");

  const q = query(projectsRef, where("uid_creador", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const proyecto = {
      id: doc.id,
      img: doc.data().img_url,
      title: doc.data().titulo,
      author: doc.data().nombre,
      rows: 2,
      cols: 2,
      featured: true,
    }
    proyectos.push(proyecto)
  });

  return proyectos;
}

export async function actualizarProyecto(id,titulo,descripcion,categoria,img_url,tags,precio){
  try {
    const docRef = await updateDoc(doc(db, "projects", id), {
      categoria: categoria,
      descripcion: descripcion,
      img_url: img_url,
      precio: precio,
      tags: tags,
      titulo: titulo,
    });
    console.log(docRef);
    return "";
  } catch (e) {
    console.error("Error adding document: ", e);
    return e
  }
}

// =========================================== GESTION DE LISTAS =========================================== //

export async function actualizarLikes(id,likes){
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    likes: likes+1
  });
}

export async function restarLikes(id,likes){
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    likes: likes-1
  });
}

export async function actualizarFavs(id,favs){
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    favs: favs+1
  });
}

export async function restarFavs(id,favs){
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    favs: favs-1
  });
}

// ======================================= GESTION DE COMENTARIOS ======================================== //
export async function obtenerFoto(uid){
  let user = {foto: "", nombre: ""}
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.id === uid) {
      user = {foto: doc.data().img_url, nombre: doc.data().nombre}
    }
  });
  return user
}

export function obtenerUserComent(uid){
  let user = {foto: "", nombre: ""}
  obtenerFoto(uid).then(res => {
    user = res
  })
  return user
}

export { analytics, auth, storage };
