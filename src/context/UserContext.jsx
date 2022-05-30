import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
  query,
  orderBy
} from "firebase/firestore";

const UsuarioContext = React.createContext();

export function UsuarioProvider(props) {
  const auth = getAuth();
  const [usuario, setUsuario] = useState({});
  
  useEffect(() => {
    if (auth.currentUser){
        setUsuario(auth.currentUser)
    }
  }, [auth.currentUser]);

  async function guardarUser(email, img_url, nombre, uid, fecha, token) {
    try {
      const docRef = await setDoc(doc(db, "users", uid), {
        email: email,
        img_url: img_url,
        nombre: nombre,
        uid: uid,
        fecha: fecha,
        token: token
      });
      console.log(docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function actualizarUser(uid, img_url, nombre) {
    const userRef = doc(db, "users", uid);

    return await updateDoc(userRef, {
      img_url: img_url,
      nombre: nombre,
    })
      .then(() => {
        recuperarUser(auth.currentUser);
        return "";
      })
      .catch((e) => {
        return e.errorMessage;
      });
  }

  async function obtenerUsers() {
    let users = [];

    const usersRef = collection(db, "users");

    const q = query(usersRef, orderBy("fecha"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let fecha = new Date(doc.data().fecha.toMillis());
      let fec = fecha.getDate()+'/'+(fecha.getMonth() + 1)+'/'+fecha.getFullYear();
      users.push({
        id: doc.id,
        Imagen: doc.data().img_url,
        Nombre: doc.data().nombre,
        Email: doc.data().email,
        UID: doc.data().uid,
        fecha: fecha,
        Fecha: fec
      });
    });

    return users;
  }

  async function guardarUserConGoogle(user) {
    const querySnapshot = await getDocs(collection(db, "users"));
    if (querySnapshot.docs.indexOf(user.uid) === -1) {
      guardarUser(
        user.email,
        user.photoURL,
        user.displayName,
        user.uid,
        new Date(auth.currentUser.metadata.creationTime),
        user.token
      );
    }
  }

  async function logUpConMail(email, password, img_url, nombre) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const save = {
          uid: user.uid,
          email: user.email,
          photoURL: img_url,
          displayName: nombre,
          token: user.accessToken
        };
        
        const fecha = new Date();
        guardarUser(email, img_url, nombre, user.uid, fecha, user.accessToken);

        setUsuario(save);
        recuperarUser(user)
        return "";
      })
      .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
      });
  }

  async function logInConGoogle() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const save = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          token: token
        };
        setUsuario(save);
        guardarUserConGoogle(save);
        recuperarUser(user)
        return "";
      })
      .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
      });
  }

  async function recuperarUser(user) {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.id === user.uid) {
        let fecha = new Date(doc.data().fecha.toMillis());
        const save = {
          uid: user.uid,
          email: user.email,
          photoURL: doc.data().img_url,
          displayName: doc.data().nombre,
          token: user.accessToken,
          fecha: fecha
        };
        setUsuario(save);
      }
    });
  }

  async function logInConMail(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const save = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          token: user.accessToken
        };

        setUsuario(save);
        recuperarUser(user);
        return "";
      })
      .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
      });
  }

  async function obtenerUsuario() {
    let fecha = "";
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
      } else {
      }
    });
    return fecha;
  }

  async function obtenerPerfil() {
    const user = auth.currentUser;
    if (user !== null) {
      return user;
    }
  }

  async function actualizarPerfil(nombre, img_url) {
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

  async function borrarUser() {
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

  function logOut() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  }
  
  const value = useMemo(() => {
      return ({
          usuario,
          obtenerUsers,
          actualizarUser,
          logUpConMail,
          logInConGoogle,
          logInConMail,
          obtenerUsuario,
          obtenerPerfil,
          actualizarPerfil,
          borrarUser,
          eliminarDoc,
          logOut
      })
  }, [usuario])
  return <UsuarioContext.Provider value={value} {...props} />
}

export function useUsuario() {
    const context = React.useContext(UsuarioContext);
    if (!context){
        throw new Error('UseUsuario debe estar dentro del proveedor UsuarioContext')
    }
    return context;
}


