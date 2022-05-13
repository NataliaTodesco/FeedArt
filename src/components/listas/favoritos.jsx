import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { addFavorites, getFavorites, restarFavs } from "../../firebaseConfig";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsuario } from "../../context/UserContext";

function Favoritos() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);

  function eliminar(index) {
    Modal.confirm({
      title: "Eliminar",
      icon: <ExclamationCircleOutlined />,
      content:
        "¿Estas seguro de que deseas eliminar este Proyecto de Tus Favoritos?",
      okText: "Eliminar",
      cancelText: "Cancelar",
      onOk() {
        let array = proyectos;
        restarFavs(proyectos[index].id,proyectos[index].datos.favs);
        array.splice(index, 1)
        addFavorites(array, usuario.uid);
        getFavorites(usuario.uid).then((res) => {
          setProyectos(res);
        });
      },
    });
  }

  useEffect(() => {
    getFavorites(usuario.uid).then((res) => {
      setProyectos(res);
    });
  }, []);

  return (
    <div className="favoritos">
      <div className="container">
        {proyectos.map((proyecto, index) => {
          return (
            <div key={index} className='text-center'>
              <ImageListItem key={index}>
                <img
                  src={proyecto.datos.img_url}
                  alt=""
                  className="img-fluid inicio-foto my-1"
                />
                <ImageListItemBar
                  title={proyecto.datos.titulo}
                  className="mb-1 text-left"
                  style={{ borderRadius: "8px" }}
                  actionIcon={
                    <div>
                      <Link to={"/project/" + proyecto.id}>
                      <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info sobre ${proyecto.title}`}
                      >
                        <InfoIcon style={{ color: "white" }} />
                      </IconButton>
                    </Link>
                    <IconButton
                      className="float-right"
                      onClick={(e) => {
                        eliminar(index);
                      }}
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info sobre ${proyecto.title}`}
                    > <DeleteIcon style={{ color: "white" }} /> </IconButton>
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

export default Favoritos;
