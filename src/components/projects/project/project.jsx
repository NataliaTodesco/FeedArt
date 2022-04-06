import { Avatar as Img, Chip } from "@mui/material";
import { Avatar, Comment } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { consultarProyecto, obtenerCreador, obtenerCategoria, actualizarLikes, actualizarFavs, restarLikes, restarFavs } from "../../../firebaseConfig";
import Footer from "../../footer/footer";
import Navbar from "../../Navbar/navbar";
import "./project.css";

function Proyecto() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState({
    id: id,
    datos: {
      descripcion: "",
      likes: 0,
      titulo: "",
      tags: [],
      comentarios: [{uid: "", comentario: ""}],
      categoria: 1,
      favs: 0,
      img_url: "",
      likes: 0,
      precio: 0,
      tags: [],
      titulo: "",
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

  // Si en mi lista likes se encuentra el proyecto con este id like es true sino es false
  const [like, setLike] = useState(false);
  const [fav, setFav] = useState(false);
  let navigate = useNavigate();

  function obtenerProyecto(){
    consultarProyecto(id).then((res) => {
        setProyecto(res);
        obtenerCreador(res.datos.uid_creador).then((res) => {
          setCreador(res);
        });
      });
  }

  useEffect(() => {
    obtenerProyecto()
  }, []);


  function onclickLike(){
      if (like) {
        restarLikes(id,proyecto.datos.likes);
        setLike(false);
        obtenerProyecto();
      } else {
        actualizarLikes(id,proyecto.datos.likes);
        setLike(true);
        obtenerProyecto();
      }
  }

  function onclickFavs(){
    if (fav) {
        restarFavs(id,proyecto.datos.favs);
        setFav(false);
        obtenerProyecto();
    } else {
        actualizarFavs(id,proyecto.datos.favs);
        setFav(true);
        obtenerProyecto();
    }
  }

  function verUsuario(uid){
    navigate('/user/'+uid)
  }

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="project container-fluid my-3">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>{proyecto.datos.titulo}</h1>
          </div>
        </div>
        <div className="row" style={{marginTop: '-1%'}}>
          <div className="col-lg-3 col-md-4">
            <div className="card card-user p-4" style={{cursor: 'pointer'}} onClick={e => {verUsuario(creador.uid)}}>
              <div className="row text-center d-flex justify-content-center">
                <div className="col-lg-12">
                    <Avatar size={115} src={creador.img_url} alt="" className="img-fluid img-creador" />
                    <h4 style={{color: 'white'}} className='mt-4'>{creador.nombre}</h4>
                    <h6 style={{color: 'white'}}>{creador.email}</h6>
                    <p className="">{creador.fecha}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pl-2">
                <h3><b>Precio:</b> <span className="badge badge-dark">${proyecto.datos.precio}</span></h3>
                <button className="btn btn-success btn-lg btn-block mb-3"> 
                    Comprar
                    <i className="bi bi-cash-coin ml-2" style={{fontSize: 'large'}}></i> 
                </button>
                {proyecto.datos.tags.map((tag, index) => (
                <Chip variant="outlined" label={tag} size="medium" key={index} className='mt-2 mb-4' />
                ))}
            </div>
          </div>
          <div className="col-lg-6 col-md-8">
            <div className="d-flex justify-content-center">
            <img
              className="img-fluid mb-1"
              src={proyecto.datos.img_url}
              alt=""
            />
            </div>
            <h4>
              <b>Descripción</b> 
              <span className="float-right">
                  {like? <i className="bi bi-hand-thumbs-up-fill mr-3" onClick={onclickLike}>{proyecto.datos.likes}</i>
                  : <i className="bi bi-hand-thumbs-up mr-3" onClick={onclickLike}>{proyecto.datos.likes}</i>}
                  {fav? <i className="bi bi-heart-fill" onClick={onclickFavs}>{proyecto.datos.favs}</i>
                  : <i className="bi bi-heart" onClick={onclickFavs}>{proyecto.datos.favs}</i>}
              </span>
            </h4> 
            <h6 className="mb-4">
                {proyecto.datos.descripcion} <br />
                <span className="float-right">
                    <h6>Categoría: <b>{obtenerCategoria(proyecto.datos.categoria)}</b></h6>
                </span>
            </h6> 
          </div>
          <div className="col-lg-3 col-md-6">
            {/* SEPARAR EN UN NUEVO COMPONENTE */}
              <div className="card card-coment">
                <h4 className="text-center" style={{color: 'white'}}>
                    Comentarios 
                    <i className="bi bi-chat-square-heart ml-3"></i>  
                </h4>
                <div className="card comentarios">
                {proyecto.datos.comentarios.map((comentario, index) => (
                    <div key={index}>
                        <Comment
                            author={<a onClick={e => {verUsuario(comentario.uid)}}>{comentario.nombre}</a>}
                            avatar={<Img onClick={e => {verUsuario(comentario.uid)}} src={comentario.foto} alt="Han Solo" />}
                            content={
                                <p>
                                    {comentario.comentario} 
                                </p>
                            }
                        />
                    </div>
                ))}
                </div>
                <div className="input-group mt-3 mb-2">
                    <input type="text" className="form-control" placeholder="Escribe un comentario..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-dark" type="button" id="button-addon2">
                            <i className="bi bi-send-fill" style={{fontSize: 'medium'}}></i>
                        </button>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Proyecto;
