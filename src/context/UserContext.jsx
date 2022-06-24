import React, { useState, useEffect, useMemo } from "react";
import {
  borrarComentario,
  db,
  obtenerCantidad,
  obtenerComentarios,
  obtenerProyectos,
} from "../firebaseConfig";
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
  sendPasswordResetEmail,
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
  orderBy,
} from "firebase/firestore";

const UsuarioContext = React.createContext();

export function UsuarioProvider(props) {
  const auth = getAuth();
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    let storage = localStorage.getItem("storage");
    storage = JSON.parse(storage);
    setUsuario(storage);
  }, []);

  async function guardarUser(email, img_url, nombre, uid, fecha, token) {
    try {
      const docRef = await setDoc(doc(db, "users", uid), {
        email: email,
        img_url: img_url,
        nombre: nombre,
        uid: uid,
        fecha: fecha,
        token: token,
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
      let fec =
        fecha.getDate() +
        "/" +
        (fecha.getMonth() + 1) +
        "/" +
        fecha.getFullYear();
      users.push({
        id: doc.id,
        Imagen: doc.data().img_url,
        Nombre: doc.data().nombre,
        Email: doc.data().email,
        UID: doc.data().uid,
        fecha: fecha,
        Fecha: fec,
        cantidad: 0,
      });
    });

    for (let i = 0; i < users.length; i++) {
      await obtenerCantidad(users[i].id).then((res) => {
        users[i].cantidad = res;
      });
    }

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
          token: user.accessToken,
        };

        const fecha = new Date();
        guardarUser(email, img_url, nombre, user.uid, fecha, user.accessToken);

        saveStorage(save);
        setUsuario(save);
        recuperarUser(user);
        return obtenerEliminados().then((res) => {
          if (res.includes(user.email)) return "Usuario Eliminado";
          else return "";
        });
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
          token: token,
        };
        saveStorage(save);
        setUsuario(save);
        guardarUserConGoogle(save);
        recuperarUser(user);
        return obtenerEliminados().then((res) => {
          if (res.includes(user.email)) return "Usuario Eliminado";
          else return "";
        });
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
          fecha: fecha,
        };
        saveStorage(save);
        setUsuario(save);
      }
    });
  }

  function saveStorage(storage) {
    localStorage.storage = JSON.stringify(storage);
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
          token: user.accessToken,
        };

        saveStorage(save);
        setUsuario(save);
        recuperarUser(user);
        return obtenerEliminados().then((res) => {
          if (res.includes(user.email)) return "Usuario Eliminado";
          else return "";
        });
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
        logOut();
      })
      .catch((error) => {
        console.log(error.errorMessage);
      });
  }

  async function borrarUsuario(uid, email) {
    deleteDoc(doc(db, "users", uid));
    deleteDoc(doc(db, "favs", uid));
    deleteDoc(doc(db, "likes", uid));
    eliminarDoc(uid);
    await obtenerProyectos().then((res) => {
      res.forEach((element) => {
        for (let index = 0; index < element.datos.comentarios.length; index++) {
          if (element.datos.comentarios[index].uid === uid) {
            eliminarComentario(element.id, index);
          }
        }
      });
    });
    eliminados(email);
    deleteUser(uid);
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
    localStorage.removeItem("storage");
  }

  async function asignarPermiso(id) {
    try {
      await setDoc(doc(db, "admins", id), {
        id: id,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function quitarPermiso(id) {
    await deleteDoc(doc(db, "admins", id));
  }

  async function eliminarComentario(id, indice) {
    let coments = [];

    await obtenerComentarios(id).then((res) => {
      coments = res;
    });
    coments.splice(indice, 1);

    borrarComentario(id, coments);
  }

  async function obtenerAdmins() {
    let admins = [];
    const querySnapshot = await getDocs(collection(db, "admins"));
    querySnapshot.forEach((doc) => {
      admins.push(doc.id);
    });
    return admins;
  }

  async function reset(email) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        return "Consulte su correo!";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  async function eliminados(email) {
    try {
      await setDoc(doc(db, "eliminados", email), {
        email,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function obtenerEliminados() {
    let array = [];
    const querySnapshot = await getDocs(collection(db, "eliminados"));
    querySnapshot.forEach((doc) => {
      array.push(doc.id);
    });
    return array;
  }

  const value = useMemo(() => {
    return {
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
      logOut,
      borrarUsuario,
      asignarPermiso,
      quitarPermiso,
      obtenerAdmins,
      reset,
      eliminados,
      obtenerEliminados,
    };
  }, [usuario]);
  return <UsuarioContext.Provider value={value} {...props} />;
}

export function useUsuario() {
  const context = React.useContext(UsuarioContext);
  if (!context) {
    throw new Error(
      "UseUsuario debe estar dentro del proveedor UsuarioContext"
    );
  }
  return context;
}
