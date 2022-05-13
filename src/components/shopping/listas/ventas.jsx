import React, { useState, useEffect } from "react";
import {
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Popover,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { actualizarEntregadoComprador, actualizarEntregadoVendedor, getCompra, getVenta } from "../../../firebaseConfig";
import { useUsuario } from "../../../context/UserContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function Ventas() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function actualizarEntrega(project,index){
    let ventas = proyectos;
    ventas[index].entregado = !ventas[index].entregado;

    let compras = [];
    await getCompra(project.comprador_uid).then(res => {
        compras = res;
    })
    compras[index].entregado = !compras[index].entregado;

    await actualizarEntregadoComprador(project.comprador_uid,compras)
    actualizarEntregadoVendedor(usuario.uid, ventas).then(res => {
        getVenta(usuario.uid).then((res) => {
            console.log(res)
            setProyectos(res);
        });
    })
  }

  useEffect(() => {
    getVenta(usuario.uid).then((res) => {
      setProyectos(res);
    });
  }, []);

  return (
    <div className="venta">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className="text-center">
              <ImageListItem key={index}>
                <img
                  src={proyecto.proyecto.datos.img_url}
                  alt=""
                  className="img-fluid inicio-foto my-1"
                />
                <ImageListItemBar
                  title={proyecto.proyecto.datos.titulo}
                  className="mb-1 text-left"
                  style={{ borderRadius: "8px" }}
                  actionIcon={
                    <div>
                      <Link to={"/project/" + proyecto.proyecto.id}>
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info sobre ${proyecto.proyecto.titulo}`}
                        >
                          <InfoIcon style={{ color: "white" }} />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-describedby={id}
                        onClick={handleClick}
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info sobre ${proyecto.proyecto.titulo}`}
                      >
                        <LocalShippingIcon style={{ color: "white" }} />
                      </IconButton>
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
                          <div>
                            <div className="custom-control custom-checkbox mb-3">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                                checked={proyecto.entregado}
                                onChange={(e) => actualizarEntrega(proyecto, index)}
                                style={{cursor: 'pointer'}}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customCheck1"
                              >
                                Entregado
                              </label>
                            </div>
                            <h6>Comprador:</h6>
                            <p>{proyecto.comprador.shipping.name.full_name}</p>
                            <h6>Email</h6>
                            <p>{proyecto.comprador.payee.email_address}</p>
                            <h6>Dirección de entrega: </h6>
                            <p>
                              {
                                proyecto.comprador.shipping.address
                                  .address_line_1
                              }
                              ,{" "}
                              {proyecto.comprador.shipping.address.admin_area_1}{" "}
                              -{" "}
                              {proyecto.comprador.shipping.address.country_code}
                            </p>
                            <h6>Fecha de Compra:</h6>
                            <p>
                              {new Date(proyecto.fecha).getDate()}/
                              {new Date(proyecto.fecha).getMonth() + 1}/
                              {new Date(proyecto.fecha).getFullYear()}
                            </p>
                          </div>
                        </Typography>
                      </Popover>
                    </div>
                  }
                />
              </ImageListItem>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ventas;
