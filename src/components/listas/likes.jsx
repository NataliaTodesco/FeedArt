import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { addLikes, getLikes, restarLikes } from "../../firebaseConfig";
import { useUsuario } from "../../context/UserContext";

function Likes() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);

  function eliminar(index) {
    Modal.confirm({
      title: "Eliminar",
      icon: <ExclamationCircleOutlined />,
      content:
        "¿Estas seguro de que deseas eliminar este Proyecto de Tus Me Gusta?",
      okText: "Eliminar",
      cancelText: "Cancelar",
      onOk() {
        let array = proyectos;
        restarLikes(proyectos[index].id, proyectos[index].datos.likes);
        array.splice(index, 1);
        addLikes(array, usuario.uid);
        getLikes(usuario.uid).then((res) => {
          setProyectos(res);
        });
      },
    });
  }

  useEffect(() => {
    getLikes(usuario.uid).then((res) => {
      setProyectos(res);
    });
  }, []);

  return (
    <div className="likes">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className="text-center">
              <ImageListItem className="proyecto" key={index}>
                <div className="portfolio-item portfolio-item--eff1">
                  <img
                    loading="lazy"
                    src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                    srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt=""
                    className="img-fluid inicio-foto my-1"
                  />
                  <div className="portfolio-item__info">
                    <h3 style={{fontWeight: '400'}} className="portfolio-item__header">
                      {proyecto.datos.titulo}
                    </h3>
                    <div className="portfolio-item__links">
                      <div className="portfolio-item__link-block">
                        <Link to={"/project/" + proyecto.id}>
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
                          onClick={(e) => {
                            eliminar(index);
                          }}
                          title="Eliminar de mis Me Gusta"
                          className="portfolio-item__link"
                        >
                          <i className="material-icons">delete</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ImageListItemBar
                  title={proyecto.datos.titulo}
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

export default Likes;
