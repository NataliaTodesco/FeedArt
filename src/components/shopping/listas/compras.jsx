import React, { useState, useEffect } from "react";
import {
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Popover,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getCompra } from "../../../firebaseConfig";
import { useUsuario } from "../../../context/UserContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function Compra() {
  const { usuario, obtenerUsers } = useUsuario();
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getCompra(usuario.uid).then((res) => {
      setProyectos(res);
    });
    obtenerUsers().then(res => {
      let users = []
      res.forEach(element => {
        users.push({nombre: element.Nombre, email: element.Email, uid: element.id})
      });
      setUsuarios(users)
    })
  }, [obtenerUsers, usuario.uid]);

  function verUser(uid){
    for (let i = 0; i < usuarios.length; i++) {
      if (uid === usuarios[i].uid)
        return usuarios[i].nombre
    }
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
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={handleClick}
                          title="Información de la Venta"
                          className="portfolio-item__link"
                        >
                          <LocalShippingIcon className="material-icons"></LocalShippingIcon>
                        </div>
                      </div>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Typography sx={{ p: 2 }}>
                          {proyecto.entregado ? (
                            <div>
                              <h5>
                                <span className="badge badge-success">
                                  Entregado
                                </span>
                              </h5>
                              <h6>Dirección de entrega: </h6>
                              <p>
                                {
                                  proyecto.comprador.shipping.address
                                    .address_line_1
                                }
                                ,{" "}
                                {
                                  proyecto.comprador.shipping.address
                                    .admin_area_1
                                }{" "}
                                -{" "}
                                {
                                  proyecto.comprador.shipping.address
                                    .country_code
                                }
                              </p>
                              <h6>Fecha de Compra:</h6>
                              <p>
                                {new Date(proyecto.fecha).getDate()}/
                                {new Date(proyecto.fecha).getMonth() + 1}/
                                {new Date(proyecto.fecha).getFullYear()}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <h5>
                                <span className="badge badge-danger">
                                  No Entregado
                                </span>
                              </h5>
                              <h6>Dirección de entrega: </h6>
                              <p>
                                {
                                  proyecto.comprador.shipping.address
                                    .address_line_1
                                }
                                ,{" "}
                                {
                                  proyecto.comprador.shipping.address
                                    .admin_area_1
                                }{" "}
                                -{" "}
                                {
                                  proyecto.comprador.shipping.address
                                    .country_code
                                }
                              </p>
                              <h6>Fecha de Compra:</h6>
                              <p>
                                {new Date(proyecto.fecha).getDate()}/
                                {new Date(proyecto.fecha).getMonth() + 1}/
                                {new Date(proyecto.fecha).getFullYear()}
                              </p>
                            </div>
                          )}
                        </Typography>
                      </Popover>
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
