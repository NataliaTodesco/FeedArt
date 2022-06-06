import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./inicio.css";
import { Link } from "react-router-dom";
import {
  obtenerProyectos,
  obtenerProyectosXCategoria,
  obtenerTags,
  obtenerTitulos,
} from "../../firebaseConfig";
import { Button } from "antd";
import {
  ImageListItem,
  ImageListItemBar,
  ImageList,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import banner from "../../img/banners/6.png";
import banner2 from "../../img/banners/7.png";
import banner3 from "../../img/banners/8.png";
import banner4 from "../../img/banners/9.png";
import { Carousel, Overlay, Popover } from "react-bootstrap";
import { useUsuario } from "../../context/UserContext";

function Inicio() {
  const { obtenerUsers } = useUsuario();
  const [usuarios, setUsuarios] = useState([{ uid: "" }]);
  const [proyectos, setProyectos] = useState([]);
  const [Categoria, setCategoria] = useState(0);
  const [search, setSearch] = useState("");
  const myContainer = useRef(null);
  const [opciones, setOpciones] = useState([]);
  const [type, setType] = useState("todos");
  const [usuario, setUsuario] = useState(null);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [Projects, setProjects] = useState([]);
  let c = 0;

  useEffect(() => {
    Proyectos(0);
    obtenerTags().then((result) => {
      obtenerTitulos().then((res) => {
        removeDuplicates(res.concat(result));
      });
    });
    obtenerUsers().then((res) => {
      let users = [];
      res.forEach((element) => {
        users.push({
          nombre: element.Nombre,
          email: element.Email,
          uid: element.id,
        });
      });
      setUsuarios(users);
    });
  }, [obtenerUsers]);

  function removeDuplicates(inArray) {
    var arr = inArray.concat();
    for (var i = 0; i < arr.length; ++i) {
      for (var j = i + 1; j < arr.length; ++j) {
        if (arr[i] === arr[j]) {
          arr.splice(j, 1);
        }
      }
    }
    setOpciones(arr);
    return arr;
  }

  function Proyectos(index) {
    if (index === 0) {
      obtenerProyectos().then((res) => {
        setProyectos(res);
        setProjects(res);
      });
    } else {
      obtenerProyectosXCategoria(index).then((res) => {
        setProyectos(res);
        setProjects(res);
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

    const Buscar = () => {
      setSearch(busqueda);
      setBusqueda("");
    };

    return (
      <div className="col-12 form form-inline mb-3" ref={myContainer}>
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
                setType("todos");
                setUsuario(null);
                setMonth(0);
                setYear(0);
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
                      setType("todos");
                      setUsuario(null);
                      setMonth(0);
                      setYear(0);
                    }}
                  >
                    {categoria.label}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        <div className="input-group search-input">
          <Filtro />
          <Autocomplete
            className="mb-3 auto"
            id="size-small-standard"
            size="small"
            options={opciones}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setSearch(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar..."
                placeholder="Buscar por título o tag..."
                className="busqueda"
              />
            )}
          />
          <Button type="primary" onClick={Buscar} size="large">
            <img
              alt=""
              src="https://img.icons8.com/ios-glyphs/30/ffffff/broom.png"
            />
          </Button>
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
      if (widthBrowser < 524) return 1;
      else if (widthBrowser < 1024) return 2;
      else return 4;
    } else return 3;
  }

  function CarouselBanner() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    return (
      <Carousel
        fade
        controls={false}
        activeIndex={index}
        onSelect={handleSelect}
        className="banner mt-3"
      >
        <Carousel.Item interval={7000}>
          <img
            src={banner}
            alt=""
            className="img-fluid banner"
            style={{ maxHeight: "340px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={7000}>
          <img
            src={banner2}
            alt=""
            className="img-fluid banner"
            style={{ maxHeight: "340px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={7000}>
          <img
            src={banner3}
            alt=""
            className="img-fluid banner"
            style={{ maxHeight: "340px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={7000}>
          <img
            src={banner4}
            alt=""
            className="img-fluid banner"
            style={{ maxHeight: "340px" }}
          />
        </Carousel.Item>
      </Carousel>
    );
  }

  function verUser(uid) {
    for (let i = 0; i < usuarios.length; i++) {
      if (uid === usuarios[i].uid) return usuarios[i].nombre;
    }
  }

  function Filtro() {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
      setShow(!show);
      setTarget(event.target);
    };

    const [tipo, setTipo] = useState(type);

    const [user, setUser] = useState(usuario);

    const [anio, setAnio] = useState(year);
    const [mes, setMes] = useState(month);

    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const handleChange = (event) => {
      setAnio(event.target.value);
    };

    function filtrar() {
      let projects = [];

      switch (tipo) {
        case "muestra":
          if (user != null) {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (
                      element.datos.precio === 0 &&
                      element.datos.uid_creador === user.uid
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          } else {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio === 0 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (element.datos.precio == 0) projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          }
          break;
        case "venta":
          if (user != null) {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      element.datos.uid_creador === user.uid
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          } else {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === false
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          }
          break;
        case "vendido":
          if (user != null) {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      element.datos.uid_creador === user.uid
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          } else {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (
                      element.datos.precio > 0 &&
                      element.datos.vendido === true
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          }
          break;
        default:
          if (user != null) {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2021
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.uid_creador === user.uid &&
                      fecha.getFullYear() === 2022
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      element.datos.uid_creador === user.uid &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    if (element.datos.uid_creador === user.uid)
                      projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
            }
          } else {
            switch (anio) {
              case 2021:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      fecha.getFullYear() === 2021 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (fecha.getFullYear() === 2021) projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              case 2022:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (
                      fecha.getFullYear() === 2022 &&
                      fecha.getMonth() + 1 === mes
                    )
                      projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (fecha.getFullYear() === 2022) projects.push(element);
                  });
                  setProyectos(projects);
                }
                break;
              default:
                if (mes !== 0) {
                  Projects.forEach((element) => {
                    let fecha = new Date(element.datos.fecha.toMillis());

                    if (fecha.getMonth() + 1 === mes) projects.push(element);
                  });
                  setProyectos(projects);
                } else {
                  setProyectos(Projects);
                }
                break;
            }
          }
          break;
      }

      setType(tipo);
      setUsuario(user);
      setMonth(mes);
      setYear(anio);
      setShow(false);
    }

    return (
      <div ref={ref}>
        <i
          className="bi bi-filter mr-2 mb-2"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        ></i>

        <Overlay show={show} target={target} placement="bottom" container={ref}>
          <Popover id="popover-contained" style={{ border: "white" }}>
            <Popover.Body
              style={{
                background: "white",
                width: "325px",
                border: ".5px solid var(--celeste-pastel)",
                borderRadius: "5px",
              }}
              className="text-left pb-3"
            >
              <h5 style={{ color: "var(--azul)" }}>Filtar por</h5>
              {/* Filtrar por Tipo */}
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Estado
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={type}
                  onChange={(e) => {
                    setTipo(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="todos"
                    control={<Radio size="small" />}
                    label="Todos"
                  />
                  <FormControlLabel
                    value="muestra"
                    control={<Radio size="small" />}
                    label="Muestra"
                  />
                  <FormControlLabel
                    value="venta"
                    control={<Radio size="small" />}
                    label="En Venta"
                  />
                  <FormControlLabel
                    value="vendido"
                    control={<Radio size="small" />}
                    label="Vendido"
                  />
                </RadioGroup>
              </FormControl>
              {/* Filtrar por Usuario */}
              <div className="userFilter">
                <FormLabel id="user">Usuario</FormLabel>
                <Autocomplete
                  aria-labelledby="user"
                  disablePortal
                  value={user}
                  onChange={(event, newValue) => {
                    setUser(newValue);
                  }}
                  className="my-2 "
                  id="size-small-standard"
                  size="small"
                  options={usuarios}
                  getOptionLabel={(option) =>
                    option.nombre + " - " + option.email
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar..."
                      placeholder="Buscar por usuario..."
                    />
                  )}
                />
              </div>
              {/* Filtrar por Fecha */}
              <div>
                <FormLabel
                  className="row mt-1 selectFecha"
                >
                  Fecha
                </FormLabel>
                <div className="row mt-3">
                  <div className="col-6">
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">Año</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={anio}
                        label="Año"
                        onChange={handleChange}
                      >
                        <MenuItem value={0}>Todos</MenuItem>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2022}>2022</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-6">
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">Mes</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mes}
                        label="Mes"
                        onChange={(e) => {
                          setMes(e.target.value);
                        }}
                      >
                        <MenuItem value={0}>Todos</MenuItem>
                        {meses.map((mes, index) => {
                          return (
                            <MenuItem key={index} value={index + 1}>
                              {mes}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={(e) => {
                    filtrar();
                  }}
                  className="btn btn-info btn-block mt-4 mb-2"
                >
                  Filtrar
                </button>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    );
  }

  return (
    <div className="inicio">
      <Navbar></Navbar>
      <CarouselBanner></CarouselBanner>
      <div className="container-fluid px-5 my-3">
        <div className="row">
          <Categorias></Categorias>
        </div>
        <div style={{ minHeight: "50vh" }}>
          {proyectos.length === 0 ? (
            <div className="alert alert-secondary" role="alert">
              No se encontró ningún proyecto
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
                        <div className="portfolio-item portfolio-item--eff1">
                          <img
                            loading="lazy"
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                          />
                          <div className="portfolio-item__info">
                            <h3 className="portfolio-item__header">
                              {proyecto.datos.titulo}
                            </h3>
                            <div className="portfolio-item__links">
                              <div className="portfolio-item__link-block">
                                <Link
                                  className="portfolio-item__link"
                                  to={"/project/" + proyecto.id}
                                >
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
                          title={proyecto.datos.titulo}
                          subtitle={verUser(proyecto.datos.uid_creador)}
                          className="mb-1 bar"
                          style={{ borderRadius: "0 0 8px 8px" }}
                          actionIcon={
                            <div className="text-light mr-1 fecha">
                              {proyecto.datos.precio > 0 &&
                              !proyecto.datos.vendido ? (
                                <p>{proyecto.datos.precio} USD</p>
                              ) : (
                                <div>
                                  {proyecto.datos.precio > 0 &&
                                  proyecto.datos.vendido ? (
                                    <p>Vendido</p>
                                  ) : (
                                    <p>Muestra</p>
                                  )}
                                </div>
                              )}
                              <br />
                              <p className="mt-1" style={{ marginBottom: "0" }}>
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getDate()}
                                /
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getMonth() + 1}
                                /
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getFullYear()}
                              </p>
                            </div>
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
                        <div className="portfolio-item portfolio-item--eff1">
                          <img
                            loading="lazy"
                            src={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format`}
                            srcSet={`${proyecto.datos.img_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            className="img-fluid inicio-foto my-1"
                          />
                          <div className="portfolio-item__info">
                            <h3 className="portfolio-item__header">
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
                            </div>
                          </div>
                        </div>
                        <ImageListItemBar
                          title={proyecto.datos.titulo}
                          subtitle={verUser(proyecto.datos.uid_creador)}
                          className="mb-1 bar"
                          style={{ borderRadius: "0 0 8px 8px" }}
                          actionIcon={
                            <div className="text-light mr-1 fecha">
                              {proyecto.datos.precio > 0 &&
                              !proyecto.datos.vendido ? (
                                <p>{proyecto.datos.precio} USD</p>
                              ) : (
                                <div>
                                  {proyecto.datos.precio > 0 &&
                                  proyecto.datos.vendido ? (
                                    <p>Vendido</p>
                                  ) : (
                                    <p>Muestra</p>
                                  )}
                                </div>
                              )}
                              <br />
                              <p className="mt-1" style={{ marginBottom: "0" }}>
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getDate()}
                                /
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getMonth() + 1}
                                /
                                {new Date(
                                  proyecto.datos.fecha.toMillis()
                                ).getFullYear()}
                              </p>
                            </div>
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
                            <p style={{ heigth: "100%" }}>
                              No se encontró ningún proyecto que coincida con la
                              búsqueda en esta categoría
                            </p>
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
