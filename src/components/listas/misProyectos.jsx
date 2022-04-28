import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { addFavorites, addLikes, borrarProyecto, getFavorites, getLikes, obtenerFavoritos, obtenerLikes, proyectosxUID, restarFavs, restarLikes } from "../../firebaseConfig";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useUsuario } from "../../context/UserContext";

function MisProyectos() {
  const { usuario } = useUsuario()
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
        obtenerLikes().then(result => {
            for (let i = 0; i < result.length; i++) {
                getLikes(result[i].id).then(res => {
                    let likes = res;
                    for (let index = 0; index < likes.length; index++) {
                      if (likes[index].id === id){
                        restarLikes(id,likes[index].datos.likes);
                        likes.splice(index,1);
                        addLikes(likes,result[i].id);
                      }
                    }
                })
            }
        })
        obtenerFavoritos().then(result => {
            for (let i = 0; i < result.length; i++) {
                getFavorites(result[i].id).then((res) => {
                    let favs = res;
                    for (let index = 0; index < favs.length; index++) {
                      if (favs[index].id === id){
                        restarFavs(id,favs[index].datos.favs);
                        favs.splice(index,1);
                        addFavorites(favs,result[i].id);
                      }
                    }
                });
            }
        })
        proyectosxUID(usuario.uid).then((res) => {
            setProyectos(res);
        });
      },
    });
  }

  useEffect(() => {
    proyectosxUID(usuario.uid).then((res) => {
      setProyectos(res);
    });
  }, [usuario]);

  return (
    <div className="misProyectos">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className="text-center">
              <ImageListItem key={index}>
                <img
                  src={proyecto.img}
                  alt=""
                  className="img-fluid inicio-foto my-1"
                  style={{ maxHeight: "225px" }}
                />
                <ImageListItemBar
                  title={proyecto.titulo}
                  className="mb-1 text-left"
                  style={{ borderRadius: "8px" }}
                  actionIcon={
                    <div>
                      <Link to={"/project/" + proyecto.id}>
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info sobre ${proyecto.titulo}`}
                        >
                          <InfoIcon style={{ color: "white" }} />
                        </IconButton>
                      </Link>
                      <Link to={"/project/edit/" + proyecto.id}>
                        <IconButton
                          className="float-right"
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`editar ${proyecto.titulo}`}
                        >
                          {" "}
                          <EditIcon style={{ color: "white" }} />{" "}
                        </IconButton>
                      </Link>
                      <IconButton
                        className="float-right"
                        onClick={(e) => {
                          eliminar(proyecto.id);
                        }}
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`eliminar ${proyecto.titulo}`}
                      >
                        {" "}
                        <DeleteIcon style={{ color: "white" }} />{" "}
                      </IconButton>
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

export default MisProyectos;
