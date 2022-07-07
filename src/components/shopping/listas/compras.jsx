import React, { useState, useEffect } from "react";
import {
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getCompra } from "../../../firebaseConfig";
import { useUsuario } from "../../../context/UserContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Modal } from "react-bootstrap";

function Compra() {
  const { usuario, obtenerUsers, obtenerEliminadosData, obtenerDeleteData } = useUsuario();
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [eliminados, setEliminados] = useState([]);
  const [deleteU, setDeleteU] = useState([]);

  useEffect(() => {
    getCompra(usuario.uid).then((res) => {
      setProyectos(res);
    });
    obtenerUsers().then((res) => {
      let users = [];
      res.forEach((element) => {
        users.push({
          nombre: element.Nombre,
          email: element.Email,
          uid: element.id,
        });
      });
      setUsuarios(users);
    });
    obtenerEliminadosData().then(res => {
      setEliminados(res)
    })
    obtenerDeleteData().then(res => {
      setDeleteU(res)
    })
  }, [obtenerUsers, usuario.uid, obtenerEliminadosData, obtenerDeleteData]);

  function verUser(uid) {
    for (let i = 0; i < usuarios.length; i++) {
      if (uid === usuarios[i].uid) return usuarios[i].nombre;
    }
    for (let index = 0; index < eliminados.length; index++) {
      if (eliminados[index].uid === uid){
        return eliminados[index].nombre
      }
    }
    for (let index = 0; index < deleteU.length; index++) {
      if (deleteU[index].uid === uid){
        return deleteU[index].nombre
      }
    }
  }

  function verEmail(uid){
    for (let i = 0; i < usuarios.length; i++) {
      if (uid === usuarios[i].uid) return usuarios[i].email;
    }
    for (let index = 0; index < eliminados.length; index++) {
      if (eliminados[index].uid === uid){
        return eliminados[index].email
      }
    }
    for (let index = 0; index < deleteU.length; index++) {
      if (deleteU[index].uid === uid){
        return deleteU[index].email
      }
    }
  }

  function ModalCompra({ proyecto, index }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <div
          style={{ cursor: "pointer" }}
          onClick={handleShow}
          title="Información de la Venta"
          className="portfolio-item__link"
        >
          <LocalShippingIcon className="material-icons"></LocalShippingIcon>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            <Typography sx={{ p: 2 }}>
              {proyecto.entregado ? (
                <h5>
                  <span className="badge badge-success">Entregado</span>
                </h5>
              ) : (
                <h5>
                  <span className="badge badge-danger">No Entregado</span>
                </h5>
              )}
              <h6>Proyecto:</h6>
              <p>{proyecto.proyecto.datos.titulo}</p>
              <h6>Vendedor:</h6>
              <p>{verUser(proyecto.proyecto.datos.uid_creador)}</p>
              <h6>Email Vendedor:</h6>
              <p>{verEmail(proyecto.proyecto.datos.uid_creador)}</p>
              <h6>Dirección de entrega: </h6>
              <p>
                {proyecto.comprador.shipping.address.address_line_1},{" "}
                {proyecto.comprador.shipping.address.admin_area_1} -{" "}
                {proyecto.comprador.shipping.address.country_code}
              </p>
              <h6>Fecha de Compra:</h6>
              <p>
                {new Date(proyecto.fecha).getDate()}/
                {new Date(proyecto.fecha).getMonth() + 1}/
                {new Date(proyecto.fecha).getFullYear()}
              </p>
              <h6>Monto:</h6>
              <p>{proyecto.comprador.amount.value} USD</p>
              <button className="btn btn-secondary float-right" onClick={handleClose}>
                Cerrar
              </button>
            </Typography>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <div className="venta">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className="text-center">
              <ImageListItem className="proyecto" key={index}>
                <div className="portfolio-item portfolio-item--eff1">
                  <img
                    loading="lazy"
                    src={`${proyecto.proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                    srcSet={`${proyecto.proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt=""
                    className="img-fluid inicio-foto my-1"
                  />
                  <div className="portfolio-item__info">
                    <h3
                      style={{ fontWeight: "400" }}
                      className="portfolio-item__header"
                    >
                      {proyecto.proyecto.datos.titulo}
                    </h3>
                    <div className="portfolio-item__links">
                      <div className="portfolio-item__link-block">
                        <Link to={"/project/" + proyecto.proyecto.id}>
                          <a
                            className="portfolio-item__link"
                            href="/"
                            title="Ver Proyecto"
                          >
                            <i className="material-icons">link</i>
                          </a>
                        </Link>
                      </div>
                      <div className="portfolio-item__link-block">
                        <ModalCompra
                          proyecto={proyecto}
                          index={index}
                        ></ModalCompra>
                      </div>
                    </div>
                  </div>
                </div>
                <ImageListItemBar
                  title={proyecto.proyecto.datos.titulo}
                  subtitle={verUser(proyecto.proyecto.datos.uid_creador)}
                  className="mb-1 bar text-left"
                  style={{ borderRadius: "0 0 8px 8px" }}
                />
              </ImageListItem>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Compra;
