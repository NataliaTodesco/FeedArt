import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import {
  addFavorites,
  addLikes,
  borrarProyecto,
  getFavorites,
  getLikes,
  misProyectos,
  obtenerFavoritos,
  obtenerLikes,
  restarFavs,
  restarLikes,
} from "../../firebaseConfig";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useUsuario } from "../../context/UserContext";
import { ImageListItem, ImageListItemBar } from "@mui/material";

function MisProyectos() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);

  function eliminar(id) {
    Modal.confirm({
      title: "Eliminar",
      icon: <ExclamationCircleOutlined />,
      content: "¿Estas seguro de que deseas eliminar este Proyecto?",
      okText: "Eliminar",
      cancelText: "Cancelar",
      onOk() {
        borrarProyecto(id);
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
        misProyectos(usuario.uid).then((res) => {
          setProyectos(res);
        });
      },
    });
  }

  useEffect(() => {
    misProyectos(usuario.uid).then((res) => {
      setProyectos(res);
    });
  }, [usuario]);

  return (
    <div className="misProyectos">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className="text-center">
              <ImageListItem className="proyecto text-left" key={index}>
                <div className="portfolio-item portfolio-item--eff1">
                  <img
                    loading="lazy"
                    src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                    srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt=""
                    className="img-fluid inicio-foto my-1"
                  />
                  <div className="portfolio-item__info">
                    <h3 style={{fontWeight: '400'}} className="portfolio-item__header">{proyecto.datos.titulo}</h3>
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
                        {!proyecto.datos.vendido ? (
                      <div className="portfolio-item__link-block">
                          <Link to={"/project/edit/" + proyecto.id}>
                            <a
                              className="portfolio-item__link"
                              href="/"
                              title="Editar Proyecto"
                            >
                              <i className="material-icons">edit</i>
                            </a>
                          </Link>
                      </div>
                        ) : (
                          <span></span>
                        )}
                        {!proyecto.datos.vendido ? (
                      <div className="portfolio-item__link-block" style={{cursor: 'pointer'}}>
                          <div
                            className="portfolio-item__link"
                            title="Eliminar Proyecto"
                            onClick={(e) => {
                              eliminar(proyecto.id);
                            }}
                          >
                            <i className="material-icons">delete</i>
                          </div>
                          </div>
                        ) : (
                          <span></span>
                        )}
                    </div>
                  </div>
                </div>
                <ImageListItemBar
                  title={proyecto.datos.titulo}
                  className="mb-1 bar"
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

export default MisProyectos;
