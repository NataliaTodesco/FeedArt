import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./inicio.css";
import { Link } from "react-router-dom";
import {
  obtenerProyectos,
  obtenerProyectosXCategoria,
} from "../../firebaseConfig";
import { Button } from "antd";
import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ImageList,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import banner from "../../img/banners/banner.svg";
import banner2 from "../../img/banners/2.svg";
import banner3 from "../../img/banners/3.svg";
import banner4 from "../../img/banners/4.svg";
import { Carousel } from "react-bootstrap";

function Inicio() {
  const [proyectos, setProyectos] = useState([]);
  const [Categoria, setCategoria] = useState(0);
  const [search, setSearch] = useState("");
  const myContainer = useRef(null);
  let c = 0;

  useEffect(() => {
    Proyectos(0);
  }, []);

  function Proyectos(index) {
    if (index === 0) {
      obtenerProyectos().then((res) => {
        setProyectos(res);
      });
    } else {
      obtenerProyectosXCategoria(index).then((res) => {
        setProyectos(res);
      });
    }
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
      <div className="form form-inline mb-3" ref={myContainer}>
        <div className="form form-inline mb-3 mt-2">
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
                Proyectos(0);
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
                      Proyectos(categoria.value);
                    }}
                  >
                    {categoria.label}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
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

  function FuntionResize() {
    if (myContainer.current) {
      var widthBrowser = myContainer.current.offsetWidth;
      if (widthBrowser < 1024) return 2;
      else return 4;
    } else return 3;
  }

  function CarouselBanner() {
    const [index, setIndex] = useState(0);
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
  
    return (
      <Carousel fade controls={false} activeIndex={index} onSelect={handleSelect} className="banner">
        <Carousel.Item interval={10000}>
          <img src={banner} alt="" className="img-fluid banner" style={{ maxHeight: "340px" }}/>
        </Carousel.Item>
        <Carousel.Item interval={10000}>
          <img src={banner2} alt="" className="img-fluid banner" style={{ maxHeight: "340px" }}/>
        </Carousel.Item>
        <Carousel.Item interval={10000}>
          <img src={banner3} alt="" className="img-fluid banner" style={{ maxHeight: "340px" }}/>
        </Carousel.Item>
        <Carousel.Item interval={10000}>
          <img src={banner4} alt="" className="img-fluid banner" style={{ maxHeight: "340px" }}/>
        </Carousel.Item>
      </Carousel>
    );
  }

  return (
    <div className="inicio">
      <Navbar></Navbar>
      <CarouselBanner></CarouselBanner>
      <div className="container my-3">
        <div className="row">
          <Categorias></Categorias>
        </div>
        <div>
          {proyectos.length === 0 ? (
            <div className="alert alert-secondary" role="alert">
              No se encontró ningún proyecto de esta <strong>Categoría</strong>
            </div>
          ) : (
            <div
              className="list"
              style={{
                maxWidth: "100%",
              }}
            >
              <ImageList variant="masonry" cols={FuntionResize()} gap={8}>
                {proyectos.map((proyecto, index) => {
                  if (search === "")
                    return (
                      <ImageListItem className="proyecto" key={index}>
                        <img
                          loading="lazy"
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
                    );
                  else if (
                    proyecto.datos.titulo.toUpperCase() ===
                      search.toUpperCase() ||
                    Mayuscula(proyecto.datos.tags).includes(
                      search.toUpperCase()
                    )
                  )
                    return (
                      <ImageListItem className="proyecto" key={index}>
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
                    );
                  else c++;
                  return (
                    <div key={index}>
                      {c === proyectos.length ? (
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="alert alert-secondary" role="alert" style={{heigth: '100%'}}>
                              No se encontró ningún proyecto que coincida con la
                              búsqueda
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  );
                })}
              </ImageList>
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Inicio;
