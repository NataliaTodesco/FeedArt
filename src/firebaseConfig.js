import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
  query,
  addDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";

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
const storage = getStorage(app);

// =========================================== GESTION DE PROYECTO =========================================== //

export async function guardarProyecto(
  titulo,
  descripcion,
  categoria,
  img_url,
  tags,
  precio,
  usuario,
  moneda
) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      categoria: categoria,
      comentarios: [],
      descripcion: descripcion,
      favs: 0,
      img_url: img_url,
      likes: 0,
      moneda: moneda,
      precio: precio,
      tags: tags,
      titulo: titulo,
      uid_creador: usuario.uid,
      vendido: false,
      fecha: new Date(),
    });
    console.log(docRef);
    return "";
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
}

export async function consultarProyecto(id) {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, datos: docSnap.data()};
  } else {
    // doc.data() will be undefined in this case
    return 'No Existe'
  }
}

export async function obtenerCreador(uid) {
  let respuesta = {};
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.id === uid) {
      let fec = new Date(doc.data().fecha.toMillis()).toLocaleDateString();
      const save = {
        uid: uid,
        email: doc.data().email,
        img_url: doc.data().img_url,
        nombre: doc.data().nombre,
        fecha: fec,
        token: doc.data().token,
      };
      respuesta = save;
    }
  });
  return respuesta;
}

export function obtenerCategoria(numero) {
  if (numero === 1) {
    return "Arte Tradicional";
  } else if (numero === 2) {
    return "Dibujos y Pinturas";
  } else if (numero === 3) {
    return "Fotografía";
  } else if (numero === 4) {
    return "Arte digital";
  } else if (numero === 5) {
    return "3D";
  } else if (numero === 6) {
    return "Esculturas";
  } else {
    return "Arte callejero";
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
      datos: doc.data(),
    };
    proyectos.push(proyecto);
  });

  return proyectos;
}

export async function misProyectos(uid) {
  let proyectos = [];
  const projectsRef = collection(db, "projects");

  const q = query(projectsRef, where("uid_creador", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const proyecto = {
      id: doc.id,
      datos: doc.data(),
    };
    proyectos.push(proyecto);
  });

  return proyectos;
}

export async function actualizarProyecto(
  id,
  titulo,
  descripcion,
  categoria,
  img_url,
  tags,
  precio,
  moneda
) {
  try {
    const docRef = await updateDoc(doc(db, "projects", id), {
      categoria: categoria,
      descripcion: descripcion,
      img_url: img_url,
      moneda: moneda,
      precio: precio,
      tags: tags,
      titulo: titulo,
      fecha: new Date(),
    });
    console.log(docRef);
    return "";
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
}

export async function borrarProyecto(id) {
  deleteDoc(doc(db, "projects", id));
  obtenerLikes().then((result) => {
    for (let i = 0; i < result.length; i++) {
      getLikes(result[i].id).then((res) => {
        let likes = res;
        for (let index = 0; index < likes.length; index++) {
          if (likes[index].id === id) {
            restarLikes(id, likes[index].datos.likes);
            likes.splice(index, 1);
            addLikes(likes, result[i].id);
          }
        }
      });
    }
  });
  obtenerFavoritos().then((result) => {
    for (let i = 0; i < result.length; i++) {
      getFavorites(result[i].id).then((res) => {
        let favs = res;
        for (let index = 0; index < favs.length; index++) {
          if (favs[index].id === id) {
            restarFavs(id, favs[index].datos.favs);
            favs.splice(index, 1);
            addFavorites(favs, result[i].id);
          }
        }
      });
    }
  });
}

export async function obtenerProyectos() {
  let projects = [];

  const projectsRef = collection(db, "projects");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

export async function obtenerComprador(uid, id) {
  let respuesta = " - ";
  const docRef = doc(db, "sell", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()){
    await docSnap.data().array.forEach((element, index) => {
      if (id === element.proyecto.id) {
        respuesta = element.comprador_uid;
      }
      if (id === 'KoiHChDli3AilmjRV84A') {
        respuesta = 'qA2c3TwTAKUc9160fsJlMtDSVgl1';
      }
    });
  }
  else respuesta = " - "
  return respuesta;
}

export async function obtenerProyectosChar() {
  let projects = [];

  const projectsRef = collection(db, "projects");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let fecha = new Date(doc.data().fecha.toMillis());
    let fec =
      fecha.getDate() +
      "/" +
      (fecha.getMonth() + 1) +
      "/" +
      fecha.getFullYear();
    let estado = "";
    if (doc.data().precio > 0 && doc.data().vendido) estado = "Vendido";
    else if (doc.data().precio === 0) estado = "Muestra";
    else estado = "En Venta";

    projects.push({
      id: doc.id,
      Titulo: doc.data().titulo,
      Categoria: obtenerCategoria(doc.data().categoria),
      Descripcion: doc.data().descripcion,
      Imagen: doc.data().img_url,
      Precio: doc.data().precio + " USD",
      Creador: doc.data().uid_creador,
      Likes: doc.data().likes,
      Favs: doc.data().favs,
      Fecha: fec,
      vendido: doc.data().vendido,
      Estado: estado,
      Comentarios: doc.data().comentarios.length,
      Comprador: doc.data().uid_creador,
    });
  });

  for (let i = 0; i < projects.length; i++) {
    await obtenerComprador(projects[i].Comprador, projects[i].id).then((res) => {
      projects[i].Comprador = res;
    });
  }
  
  for (let i = 0; i < projects.length; i++) {
    await obtenerCreador(projects[i].Creador).then((res) => {
      projects[i].Creador = res.nombre;
    });
  }

  return projects;
}

export async function obtenerProyectosXCategoria(num) {
  let projects = [];

  const projectsRef = collection(db, "projects");

  const q = query(projectsRef, where("categoria", "==", num));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

export async function obtenerCantidad(uid) {
  let cantidad = 0;
  const querySnapshot = await getDocs(collection(db, "projects"));
  querySnapshot.forEach((doc) => {
    if (doc.data().uid_creador === uid) {
      cantidad++;
    }
  });
  return cantidad;
}

export async function usuariosMasProyectos() {
  let proyectosXUser = [];

  const projectsRef = collection(db, "users");
  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    proyectosXUser.push({
      id: doc.id,
      nombre: doc.data().nombre,
      email: doc.data().email,
      img_url: doc.data().img_url,
      cantidad: 0,
    });
  });

  for (let i = 0; i < proyectosXUser.length; i++) {
    await obtenerCantidad(proyectosXUser[i].id).then((res) => {
      proyectosXUser[i].cantidad = res;
    });
  }

  return proyectosXUser;
}

export async function obtenerTags() {
  let tags = [];

  const projectsRef = collection(db, "tags");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  await querySnapshot.forEach((doc) => {
    tags.push(doc.data().tag);
  });

  return tags;
}

export async function obtenerTitulos() {
  let projects = [];

  const projectsRef = collection(db, "projects");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  await querySnapshot.forEach((doc) => {
    projects.push(doc.data().titulo);
  });

  return projects;
}

export async function addTags(tag) {
  try {
    await addDoc(collection(db, "tags"), {
      tag: tag,
    });
    return "";
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
}

// =========================================== GESTION DE LISTAS =========================================== //

export async function actualizarLikes(id, likes) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    likes: likes + 1,
  });
}

export async function restarLikes(id, likes) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    likes: likes - 1,
  });
}

export async function actualizarFavs(id, favs) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    favs: favs + 1,
  });
}

export async function restarFavs(id, favs) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    favs: favs - 1,
  });
}

export async function existeEnLikes(id, usuario) {
  let existe = false;
  let c = 0;
  let uid = usuario.uid;

  const docRef = doc(db, "likes", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    docSnap.data().array.forEach((project) => {
      if (project.id === id) c++;
    });
  }

  if (c !== 0) existe = true;

  return existe;
}

export async function existeEnFavs(id, usuario) {
  let existe = false;
  let c = 0;
  let uid = usuario.uid;

  const docRef = doc(db, "favs", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    docSnap.data().array.forEach((project) => {
      if (project.id === id) c++;
    });
  }

  if (c !== 0) existe = true;

  return existe;
}

export function addFavorites(array, uid) {
  try {
    return setDoc(doc(db, "favs", uid), {
      array,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getFavorites(uid) {
  const docRef = doc(db, "favs", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().array;
  } else {
    return [];
  }
}

export async function obtenerFavoritos() {
  let projects = [];

  const projectsRef = collection(db, "favs");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

export function addLikes(array, uid) {
  try {
    return setDoc(doc(db, "likes", uid), {
      array,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getLikes(uid) {
  const docRef = doc(db, "likes", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().array;
  } else {
    return [];
  }
}

export async function obtenerLikes() {
  let projects = [];

  const projectsRef = collection(db, "likes");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

// ======================================= GESTION DE COMENTARIOS ======================================== //
export async function registrarComentario(id, comentarios) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    comentarios: comentarios,
  });
}

export async function obtenerComentarios(id) {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().comentarios;
  } else {
    console.log("No such document!");
  }
}

export async function borrarComentario(id, comentarios) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    comentarios: comentarios,
  });
}

// ========================================== GESTION DE COMPRA =========================================== //
export function addCompra(array, uid) {
  try {
    return setDoc(doc(db, "buy", uid), {
      array,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getCompra(uid) {
  const docRef = doc(db, "buy", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().array;
  } else {
    return [];
  }
}

export async function obtenerCompras() {
  let projects = [];

  const projectsRef = collection(db, "buy");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

export function addVenta(array, uid) {
  try {
    return setDoc(doc(db, "sell", uid), {
      array,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getVenta(uid) {
  const docRef = doc(db, "sell", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().array;
  } else {
    return [];
  }
}

export async function obtenerVenta() {
  let projects = [];

  const projectsRef = collection(db, "sell");

  const q = query(projectsRef);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, datos: doc.data() });
  });

  return projects;
}

export async function actualizarVendido(id) {
  const projectsRef = doc(db, "projects", id);
  await updateDoc(projectsRef, {
    vendido: true,
  });
}

export async function actualizarEntregadoVendedor(id, array) {
  const projectsRef = doc(db, "sell", id);
  await updateDoc(projectsRef, {
    array: array,
  });
}

export async function actualizarEntregadoComprador(id, array) {
  console.log(array[2]);
  const projectsRef = doc(db, "buy", id);
  await updateDoc(projectsRef, {
    array: array,
  });
}

// =========================================== NOTIFICACIONES =========================================== //
export async function addNotification(id, tipo, usuario) {
  try {
    let array = [];
    let uid = "";
    let project = {};
    let index = 0;

    await consultarProyecto(id).then((res) => {
      uid = res.datos.uid_creador;
      project = res;
    });

    await getNotification(uid).then((res) => {
      array = res;
      index = res.length;
    });

    if (usuario.uid !== uid)
      array.push({
        proyecto: project,
        tipo: tipo,
        user: usuario,
        leido: false,
        id: index,
      });

    return await setDoc(doc(db, "notifications", uid), {
      array,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getNotification(uid) {
  const docRef = doc(db, "notifications", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().array;
  } else {
    return [];
  }
}

export async function actualizarLeido(uid, index) {
  let array = [];

  await getNotification(uid).then((res) => {
    array = res;
  });

  console.log(index);
  array[index].leido = true;

  const projectsRef = doc(db, "notifications", uid);
  await updateDoc(projectsRef, {
    array: array,
  });
}

export { analytics, storage, db };
