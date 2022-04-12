import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./inicio.css";
import { Link } from "react-router-dom";
import {
  obtenerProyectos,
  obtenerProyectosXCategoria,
} from "../../firebaseConfig";
import { Button } from "antd";
import { ImageListItem, ImageListItemBar, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

function Inicio() {
  const [proyectos, setProyectos] = useState([]);
  const [Categoria, setCategoria] = useState(0);
  const [tradicional, setTradicional] = useState([]);
  const [dibujoXpintura, setDibujoXpintura] = useState([]);
  const [fotografia, setFotografia] = useState([]);
  const [digital, setDigital] = useState([]);
  const [_3d, set_3d] = useState([]);
  const [escultura, setEscultura] = useState([]);
  const [callejero, setCallejero] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Proyectos();
  }, []);

  function Proyectos() {
    obtenerProyectos().then((res) => {
      setProyectos(res);
    });
    obtenerProyectosXCategoria(1).then((res) => {
      setTradicional(res);
    });
    obtenerProyectosXCategoria(2).then((res) => {
      setDibujoXpintura(res);
    });
    obtenerProyectosXCategoria(3).then((res) => {
      setFotografia(res);
    });
    obtenerProyectosXCategoria(4).then((res) => {
      setDigital(res);
    });
    obtenerProyectosXCategoria(5).then((res) => {
      set_3d(res);
    });
    obtenerProyectosXCategoria(6).then((res) => {
      setEscultura(res);
    });
    obtenerProyectosXCategoria(7).then((res) => {
      setCallejero(res);
    });
  }

  function Categorias() {
    const categorias = [
      {
        value: 1,
        label: "Arte Tradicional",
      },
      {
        value: 2,
        label: "Dibujos y Pinturas",
      },
      {
        value: 3,
        label: "Fotografia",
      },
      {
        value: 4,
        label: "Arte digital",
      },
      {
        value: 5,
        label: "3D",
      },
      {
        value: 6,
        label: "Esculturas",
      },

      {
        value: 7,
        label: "Arte callejero",
      },
    ];
    const [busqueda, setBusqueda] = useState("");

    function Cambiar(event) {
      setBusqueda(event.target.value);
    }

    const Buscar = () => {
      setSearch(busqueda);
      setBusqueda("");
    };

    return (
      <div className="form form-inline mb-3">
        {Categoria === 0 ? (
          <Button type="primary" shape="round" size={"medium"}>
            Todos
          </Button>
        ) : (
          <Button
            shape="round"
            size={"medium"}
            onClick={(e) => {
              setCategoria(0);
              setSearch("");
            }}
          >
            Todos
          </Button>
        )}
        {categorias.map((categoria) => {
          return (
            <div key={categoria.value}>
              {Categoria === categoria.value ? (
                <Button type="primary" shape="round" size={"medium"}>
                  {categoria.label}
                </Button>
              ) : (
                <Button
                  shape="round"
                  size={"medium"}
                  onClick={(e) => {
                    setCategoria(categoria.value);
                    setSearch("");
                  }}
                >
                  {categoria.label}
                </Button>
              )}
            </div>
          );
        })}
        <div className="input-group ml-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => {
              Cambiar(e);
            }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={() => {
                Buscar();
              }}
            >
              <i className="bi bi-search" style={{ fontSize: "medium" }}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function Mayuscula(array) {
    let tags = array;
    for (let i = 0; i < array.length; i++) {
      tags[i] = tags[i].toUpperCase();
    }
    return tags;
  }

  return (
    <div className="inicio">
      <Navbar></Navbar>
      <div className="container my-3">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>INICIO</h1>
          </div>
        </div>
        <div className="row">
          <Categorias></Categorias>
        </div>
        { Categoria === 0 ? (
          <div>
            {proyectos.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {proyectos.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>
                })}{" "}
              </div>
            )}
          </div>
        ) : Categoria === 1 ? (
          <div>
            {tradicional.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {tradicional.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}
              </div>
            )}
          </div>
        ) : Categoria === 2 ? (
          <div>
            {dibujoXpintura.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {dibujoXpintura.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}{" "}
              </div>
            )}
          </div>
        ) : Categoria === 3 ? (
          <div>
            {fotografia.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {fotografia.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}{" "}
              </div>
            )}
          </div>
        ) : Categoria === 4 ? (
          <div>
            {digital.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {digital.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}{" "}
              </div>
            )}
          </div>
        ) : Categoria === 5 ? (
          <div>
            {_3d.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row"> </div>
            )}
            {_3d.map((proyecto, index) => {
              if (search === "")
                return (
                  <div key={index} className="col-lg-3 col-md-4 mb-2 proyecto">
                    <ImageListItem key={index}>
                      <img
                        src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                        srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt=""
                        className="img-fluid inicio-foto my-1"
                        style={{ maxHeight: "250px" }}
                      />
                      <ImageListItemBar
                        title={proyecto.datos.titulo}
                        className="mb-1"
                        style={{ borderRadius: "8px" }}
                        actionIcon={
                          <Link to={"/project/" + proyecto.id}>
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label={`info sobre ${proyecto.title}`}
                            >
                              <InfoIcon style={{ color: "white" }} />
                            </IconButton>
                          </Link>
                        }
                      />
                    </ImageListItem>
                  </div>
                );
              else if (
                proyecto.datos.titulo.toUpperCase() === search.toUpperCase() ||
                Mayuscula(proyecto.datos.tags).includes(search.toUpperCase())
              )
                return (
                  <div key={index} className="col-lg-3 col-md-4 mb-2 proyecto">
                    <ImageListItem>
                      <img
                        src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                        srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt=""
                        className="img-fluid inicio-foto my-1"
                        style={{ maxHeight: "250px" }}
                      />
                      <ImageListItemBar
                        title={proyecto.datos.titulo}
                        className="mb-1"
                        style={{ borderRadius: "8px" }}
                        actionIcon={
                          <Link to={"/project/" + proyecto.id}>
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label={`info sobre ${proyecto.title}`}
                            >
                              <InfoIcon style={{ color: "white" }} />
                            </IconButton>
                          </Link>
                        }
                      />
                    </ImageListItem>
                  </div>
                );
              else return <div key={index}></div>;
            })}
          </div>
        ) : Categoria === 6 ? (
          <div>
            {escultura.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {escultura.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {callejero.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No se encontró ningún proyecto de esta{" "}
                <strong>Categoría</strong>
              </div>
            ) : (
              <div className="row">
                {callejero.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem key={index}>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <div
                        key={index}
                        className="col-lg-3 col-md-4 mb-2 proyecto"
                      >
                        <ImageListItem>
                          <img
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                            style={{ maxHeight: "250px" }}
                          />
                          <ImageListItemBar
                            title={proyecto.datos.titulo}
                            className="mb-1"
                            style={{ borderRadius: "8px" }}
                            actionIcon={
                              <Link to={"/project/" + proyecto.id}>
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                  aria-label={`info sobre ${proyecto.title}`}
                                >
                                  <InfoIcon style={{ color: "white" }} />
                                </IconButton>
                              </Link>
                            }
                          />
                        </ImageListItem>
                      </div>
                    );
                  else return <div key={index}></div>;
                })}{" "}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Inicio;
