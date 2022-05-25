import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { obtenerCreador, proyectosxUID } from "../../../firebaseConfig";
import Footer from "../../footer/footer";
import Navbar from "../../Navbar/navbar";
import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ImageList,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Avatar } from "antd";

function UsuarioUID() {
  const { uid } = useParams();
  const [creador, setCreador] = useState({
    img_url: "",
    uid: "",
    email: "",
    nombre: "",
    fecha: new Date().toLocaleDateString(),
  });
  const [itemData, setItemData] = useState([
    {
      id: 0,
      img: "",
      title: "",
      author: "",
      rows: 2,
      cols: 2,
      featured: true,
    },
  ]);
  let navigate = useNavigate();

  function verProyecto(id) {
    navigate("/project/" + id);
  }

  useEffect(() => {
    obtenerCreador(uid).then((res) => {
      setCreador(res);
    });
    proyectosxUID(uid).then((res) => {
      setItemData(res);
    });
  }, []);

  const myContainer = useRef(null);

  function FuntionResize() {
    if (myContainer.current){
    var widthBrowser = myContainer.current.offsetWidth;
    if (widthBrowser < 1024) 
     return 1
    else return 3
   }
   else return 2
  }

  return (
    <div id="proyectos" ref={myContainer} style={{backgroundColor: 'rgb(237, 237, 241)'}}>
      <Navbar></Navbar>
      <div className="container my-3" style={{ minHeight: "62.5vh" }}>
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>USUARIO</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4 mb-3">
            <div
              className="card card-user p-4"
              style={{ backgroundColor: "var(--azul)" }}
            >
              <div className="row text-center d-flex justify-content-center">
                <div className="col-lg-12">
                  <Avatar
                    size={145}
                    src={creador.img_url}
                    alt=""
                    className="img-fluid img-creador"
                    style={{ borderRadius: "50%" }}
                  />
                  <h4 style={{ color: "white" }} className="mt-4">
                    {creador.nombre}
                  </h4>
                  <h6 style={{ color: "white" }}>{creador.email}</h6>
                  <p className="">{creador.fecha}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-8">
            <h3>
              <b>PROYECTOS</b>
            </h3>
            {itemData.length > 0 ? (
              <div className="list" style={{
                maxWidth: "100%",
                maxHeight: 450,
                overflowY: "scroll",
              }}>
                <ImageList
                variant="masonry"
                cols={FuntionResize()}
                gap={8}
              >
                {itemData.map((item) => (
                  <ImageListItem className="proyecto" key={item.img}>
                  <div className="portfolio-item portfolio-item--eff1">
                    <img
                      loading="lazy"
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=4 2x`}
                      alt={item.title}
                      style={{ borderRadius: "8px" }}
                      className="img-fluid inicio-foto my-1"
                    />
                    <div className="portfolio-item__info">
                      <h3 className="portfolio-item__header">
                        {item.title}
                      </h3>
                      <div className="portfolio-item__links">
                        <div className="portfolio-item__link-block">
                        <Link to={"/project/" + item.id}>
                          <a
                            className="portfolio-item__link"
                            href="/"
                            title="Ver Proyecto"
                          >
                            <i className="material-icons">link</i>
                          </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ImageListItemBar
                    title={item.title}
                    className="mb-1 bar"
                    style={{ borderRadius: "0 0 8px 8px" }}
                  />
                </ImageListItem>
                ))}
              </ImageList>
              </div>
            ) : (
              <div className="alert alert-secondary" role="alert">
                El usuario <b>{creador.nombre}</b> no tiene ningún proyecto.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default UsuarioUID;
