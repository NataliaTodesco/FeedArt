import { Chip } from "@mui/material";
import { Avatar } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../../../context/UserContext";
import {
  consultarProyecto,
  obtenerCreador,
  obtenerCategoria,
  actualizarLikes,
  actualizarFavs,
  restarLikes,
  restarFavs,
  existeEnLikes,
  existeEnFavs,
  getFavorites,
  addFavorites,
  getLikes,
  addLikes,
  addNotification,
} from "../../../firebaseConfig";
import Footer from "../../footer/footer";
import Navbar from "../../Navbar/navbar";
import Comentario from "./comentarios/comentarios";
import "./project.css";
import { message } from "antd";
import { PayPalButton } from "react-paypal-button-v2";
import {
  actualizarVendido,
  addCompra,
  addVenta,
  getCompra,
  getVenta,
} from "../../../firebaseConfig";

function Proyecto() {
  const { id } = useParams();
  const { usuario } = useUsuario();
  let navigate = useNavigate();

  const [proyecto, setProyecto] = useState({
    id: id,
    datos: {
      descripcion: "",
      likes: 0,
      titulo: "",
      tags: [],
      comentarios: [{ uid: "", comentario: "" }],
      categoria: 1,
      favs: 0,
      img_url: "",
      precio: 0,
      uid_creador: "",
    },
  });
  const [creador, setCreador] = useState({
    img_url: "",
    uid: "",
    email: "",
    nombre: "",
    fecha: new Date().toLocaleDateString(),
  });
  const [vendido, setVendido] = useState(false);

  const [like, setLike] = useState(false);
  const [fav, setFav] = useState(false);

  function obtenerProyecto() {
    consultarProyecto(id).then((res) => {
      setProyecto(res);
      obtenerCreador(res.datos.uid_creador).then((res) => {
        setCreador(res);
      });
      setVendido(res.datos.vendido);
    });
  }

  useEffect(() => {
    obtenerProyecto();
    existeEnLikes(id, usuario).then((res) => {
      setLike(res);
    });
    existeEnFavs(id, usuario).then((res) => {
      setFav(res);
    });
  }, [id, usuario]);

  function Usuario() {
    function verUsuario(uid) {
      navigate("/user/" + uid);
    }

    return (
      <div
        className="card card-user p-3"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          verUsuario(creador.uid);
        }}
      >
        <div className="row text-center d-flex justify-content-center">
          <div className="col-lg-12">
            <Avatar
              size={115}
              src={creador.img_url}
              alt=""
              className="img-fluid img-creador"
            />
            <h4 style={{ color: "white" }} className="mt-4">
              {creador.nombre}
            </h4>
            <h6 style={{ color: "white" }}>{creador.email}</h6>
            <p className="">{creador.fecha}</p>
          </div>
        </div>
      </div>
    );
  }

  function Tags() {
    return (
      <div>
        {proyecto.datos.tags.map((tag, index) => (
          <Chip
            variant="outlined"
            label={tag}
            size="medium"
            key={index}
            className="mt-2 "
          />
        ))}
      </div>
    );
  }

  function Compra() {
    function Pagar({ proyecto, creador }) {
      async function guardarVenta(details) {
        actualizarVendido(proyecto.id);
        let venta = [];
        await getVenta(creador.uid).then((res) => {
          venta = res;
        });
        venta.push({
          proyecto: proyecto,
          entregado: false,
          comprador: details.purchase_units[0],
          comprador_uid: usuario.uid,
          fecha: details.update_time,
        });
        addVenta(venta, creador.uid);
      }

      async function guardarCompra(details) {
        let compra = [];
        await getCompra(usuario.uid).then((res) => {
          compra = res;
        });
        compra.push({
          proyecto: proyecto,
          entregado: false,
          comprador: details.purchase_units[0],
          comprador_uid: usuario.uid,
          fecha: details.update_time,
        });
        addCompra(compra, usuario.uid);
      }

      const success = () => {
        message.success("¡Compra realizada con éxito!");
        setVendido(true);
        addNotification(id, 'Comprado', usuario)
      };

      return (
        <div>
          <PayPalButton
            options={{
              clientId:
                //Live "AWwVouriJtFDZGm81rWS1XhPcFWcCtp4LlIcMnfs8zkGFUBdIshahIL3BZqkuDStgSYzXOnw22LwKVv0",
                // Sandbox "AS3T_m64SF8mvaVEGqam0_SQsfpO7c_SpAa6NufjUcVr05Nyb3G9SpVTY6DePN8JUGrNIBqG0laFOJ8Q",
                'ATPgLnuTb0AI3gY4TlK9ARCkl5kEMwVQA_Nvu_uyHYO2b5i6UfyyDa8FDseBpFZelRg3yTeo8cHa2SQY',
              currency: "USD",
            }}
            amount={proyecto.datos.precio}
            payee={{
              email_address: creador.email,
            }}
            onSuccess={(details, data) => {
              guardarVenta(details);
              guardarCompra(details);
              success();
              console.log({ details, data });
            }}
            onCancel={() => {
              message.error("Compra Cancelada");
            }}
          />
        </div>
      );
    }

    return (
      <div>
        {proyecto.datos.precio < 1 ? (
          <span></span>
        ) : (
          <div>
            {/* Precio */}
            <h3 className="mt-2">
              <b>Precio:</b>{" "}
              <span className="badge badge-dark">
                ${proyecto.datos.precio} USD
              </span>
            </h3>
            {/* Comprar */}
            {vendido ? (
              <span className="btn btn-success btn-lg btn-block" disabled>
                Vendido
                <i
                  className="bi bi-check2-circle ml-2"
                  style={{ fontSize: "large" }}
                ></i>
              </span>
            ) : (
              <Pagar
                proyecto={proyecto}
                creador={creador}
                setVendido={vendido}
              ></Pagar>
            )}
          </div>
        )}
      </div>
    );
  }

  function Proyecto() {
    function onclickLike() {
      if (like) {
        restarLikes(id, proyecto.datos.likes);
        setLike(false);
        obtenerProyecto();
        getLikes(usuario.uid).then((res) => {
          let likes = res;
          for (let index = 0; index < likes.length; index++) {
            if (likes[index].id === id) {
              likes.splice(index, 1);
              addLikes(likes, usuario.uid);
            }
          }
        });
      } else {
        actualizarLikes(id, proyecto.datos.likes);
        setLike(true);
        obtenerProyecto();
        getLikes(usuario.uid).then((res) => {
          let likes = res;
          let project = proyecto;
          project.datos.likes = project.datos.likes + 1;
          likes.push(project);
          addLikes(likes, usuario.uid);
        });
        addNotification(id, 'Me Gusta', usuario)
      }
    }

    function onclickFavs() {
      if (fav) {
        restarFavs(id, proyecto.datos.favs);
        setFav(false);
        obtenerProyecto();
        getFavorites(usuario.uid).then((res) => {
          let favs = res;
          for (let index = 0; index < favs.length; index++) {
            if (favs[index].id === id) {
              favs.splice(index, 1);
              addFavorites(favs, usuario.uid);
            }
          }
        });
      } else {
        actualizarFavs(id, proyecto.datos.favs);
        setFav(true);
        obtenerProyecto();
        getFavorites(usuario.uid).then((res) => {
          let favs = res;
          let project = proyecto;
          project.datos.favs = project.datos.favs + 1;
          favs.push(project);
          addFavorites(favs, usuario.uid);
        });
        addNotification( id, 'Favorito', usuario)
      }
    }

    function LikeFav() {
      return (
        <span className="float-right">
          {like ? (
            <i className="bi bi-hand-thumbs-up-fill mr-3" onClick={onclickLike}>
              {proyecto.datos.likes}
            </i>
          ) : (
            <i className="bi bi-hand-thumbs-up mr-3" onClick={onclickLike}>
              {proyecto.datos.likes}
            </i>
          )}
          {fav ? (
            <i className="bi bi-heart-fill" onClick={onclickFavs}>
              {proyecto.datos.favs}
            </i>
          ) : (
            <i className="bi bi-heart" onClick={onclickFavs}>
              {proyecto.datos.favs}
            </i>
          )}
        </span>
      );
    }

    return (
      <div>
        <div className="d-flex justify-content-center">
          <img className="img-fluid mb-1" src={proyecto.datos.img_url} alt="" />
        </div>
        <h4>
          <b>Descripción</b>
          <LikeFav />
        </h4>
        <h6 className="mb-4">
          {proyecto.datos.descripcion} <br />
          <span className="float-right">
            <h6>
              Categoría: <b>{obtenerCategoria(proyecto.datos.categoria)}</b>
            </h6>
          </span>
        </h6>
      </div>
    );
  }

  return (
    <div className="projectid">
      <Navbar></Navbar>
      <div className="project container-fluid my-3">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>{proyecto.datos.titulo}</h1>
          </div>
        </div>
        <div className="row" style={{ marginTop: "-1%" }}>
          <div className="col-lg-3 col-md-4">
            <Usuario />
            <div className="mt-1 pl-2 mb-4">
              <Tags />
              <Compra />
            </div>
          </div>
          <div className="col-lg-6 col-md-8">
            <Proyecto />
          </div>
          <div className="col-lg-3 col-md-6">
            <Comentario id={id} proyecto={proyecto}></Comentario>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Proyecto;
