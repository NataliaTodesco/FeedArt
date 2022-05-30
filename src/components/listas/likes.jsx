import React, { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ImageListItem, ImageListItemBar } from "@mui/material";
import { Link } from "react-router-dom";
import { addLikes, getLikes, restarLikes } from "../../firebaseConfig";
import { useUsuario } from "../../context/UserContext";

function Likes() {
  const { usuario, obtenerUsers } = useUsuario();
  const [usuarios, setUsuarios] = useState([]);
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
        message.success("Proyecto Eliminado de Tus Me Gusta");
      },
    });
  }

  function verUser(uid){
    for (let i = 0; i < usuarios.length; i++) {
      if (uid === usuarios[i].uid)
        return usuarios[i].nombre
    }
  }

  useEffect(() => {
    getLikes(usuario.uid).then((res) => {
      setProyectos(res);
    });
    obtenerUsers().then(res => {
      let users = []
      res.forEach(element => {
        users.push({nombre: element.Nombre, email: element.Email, uid: element.id})
      });
      setUsuarios(users)
    })
  }, [obtenerUsers, usuario]);

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
                  subtitle={verUser(proyecto.datos.uid_creador)}
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
