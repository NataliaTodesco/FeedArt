import React, { useState, useEffect } from "react";
import Footer from "../../footer/footer";
import Navbar from "../../Navbar/navbar";
import "./newProject.css";
import { InboxOutlined } from "@ant-design/icons";
import {
  TextField,
  MenuItem,
  Fab,
  DialogActions,
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  Chip,
  Alert,
  AlertTitle,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import newProject from "../../../img/logoVertical.svg";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { addTags, guardarProyecto, obtenerTags, storage } from "../../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useUsuario } from "../../../context/UserContext";
import { message } from "antd";

function NewProject() {
  let navigate = useNavigate();
  const { usuario } = useUsuario();

  const [foto, setFoto] = useState(newProject);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [vender, setVender] = useState(false);
  const [state, setState] = useState();
  
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  
  const [tagsDB, setTagsDB] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [texto, setTexto] = useState("");
  
  const [categoria, setCategoria] = React.useState(1);
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
  
  useEffect(() => {
    obtenerTags().then((res) => {
      setTagsDB(res);
    });
  }, []);

  function Tags() {
    const [open, setOpen] = React.useState(false);
    const [tag, setTag] = useState("");
    const [value, setValue] = useState(texto);
    const [tags, setTags] = useState(etiquetas);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      if (reason !== "backdropClick") {
        setEtiquetas(tags);
        setOpen(false);
        setTexto(value);
      }
    };

    function agregar() {
      if (value === "") {
        setValue(tag);
      } else {
        setValue(value + ", " + tag);
      }
      setTags([...tags, tag]);
      setTag("");
    }

    function cancel() {
      setTags([]);
      setValue("");
      setTag("");
      setEtiquetas([]);
      setTexto("");
      setOpen(false);
    }

    function quitar(index) {
      tags.splice(index, 1);
      let Tags = "";
      tags.forEach((tag) => {
        if (Tags === "") {
          Tags = tag;
        } else Tags += ", " + tag;
      });
      setValue(Tags);
    }

    const fixedOptions = [];
    const [values, setValues] = useState([...fixedOptions]);

    return (
      <div>
        <TextField
          label="Tags"
          id="demo-multiple-checkbox"
          value={texto}
          variant="standard"
          onClick={handleClickOpen}
          fullWidth
          aria-readonly
          autoComplete="off"
        />
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>Agregar Tags</DialogTitle>
          <DialogContent>
            <Autocomplete
              multiple
              id="fixed-tags-demo"
              value={values}
              onChange={(event, newValue) => {
                setValues(newValue.filter(option => option.index === -1))
                setTags([...tags, newValue[0]]); 
                if (value === "") {
                  setValue(newValue[0]);
                } else {
                  setValue(value + ", " + newValue[0]);
                }
              }}
              options={tagsDB}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar tag"
                  variant="standard"
                  placeholder="Tag..."
                  className="mb-4"
                />
              )}
            />
            <TextField
              id="standard-basic"
              label="Agregar nuevo tag"
              variant="standard"
              onChange={(e) => setTag(e.target.value)}
              value={tag}
              className="mb-4"
              autoComplete='off'
            />
            <Fab
              className="ml-4 float-right"
              color="primary"
              aria-label="add"
              onClick={agregar}
            >
              <AddIcon />
            </Fab>{" "}
            <br />
            {tags.map((tag, index) => (
              <Chip
                variant="outlined"
                label={tag}
                style={{ cursor: "pointer" }}
                size="medium"
                key={index}
                onClick={(e) => {
                  quitar(index);
                }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={cancel}>Cancel</Button>
            <Button onClick={handleClose}>Listo</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  function Alerta() {
    const handleClose = (event, reason) => {
      if (reason !== "backdropClick") {
        setShowAlert(false);
      }
    };

    return (
      <Dialog disableEscapeKeyDown open={showAlert} onClose={handleClose}>
        <DialogTitle>
          <Alert severity="error" className="pt-4">
            <AlertTitle>Error al Registrar el Proyecto</AlertTitle>
            Por favor <strong>{alert}</strong> <br />
            <Button
              className="float-right text-danger mt-4 ml-2"
              onClick={handleClose}
            >
              Ok
            </Button>
          </Alert>
        </DialogTitle>
      </Dialog>
    );
  }

  const handleChange = (event) => {
    setCategoria(event.target.value);
  };

  function onUpload(event) {
    setCargando(true);
    const file = event.target.files[0];
    const storageRef = ref(storage, `fotos/${file.name}`);

    uploadBytes(storageRef, file);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");

        setState(progress);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(ref(storage, `fotos/${file.name}`)).then((url) => {
          setFoto(url);
        });

        setState(0);
        setCargando(false);
      }
    );
  }

  function subir() {
    if (foto !== newProject && foto !== "") {
      if (titulo !== "") {
        if (descripcion !== "") {
          if (precio !== "") {
            setShowAlert(false);
            if (vender) {
              guardarProyecto(
                titulo,
                descripcion,
                categoria,
                foto,
                etiquetas,
                precio,
                usuario,
                "USD"
              ).then((res) => {
                if (res === "") {
                  navigate("/home");
                } else {
                  setShowAlert(true);
                  setAlert(res);
                }
              });
              message.success("Proyecto Subido");
            } else {
              guardarProyecto(
                titulo,
                descripcion,
                categoria,
                foto,
                etiquetas,
                0,
                usuario,
                "USD"
              ).then((res) => {
                if (res === "") {
                  navigate("/home");
                } else {
                  setShowAlert(true);
                  setAlert(res);
                }
              });
              message.success("Proyecto Subido");
            }

            for (let index = 0; index < etiquetas.length; index++) {
              if (!tagsDB.includes(etiquetas[index])){
                addTags(etiquetas[index])
              }
            }
          } else {
            if (vender) {
              setAlert(
                'Complete el campo "Precio" o quite su selección en "Vender"'
              );
              setShowAlert(true);
            } else {
              setShowAlert(false);
              guardarProyecto(
                titulo,
                descripcion,
                categoria,
                foto,
                etiquetas,
                0,
                usuario,
                "USD"
              ).then((res) => {
                if (res === "") {
                  navigate("/home");
                } else {
                  setShowAlert(true);
                  setAlert(res);
                }
              });
              message.success("Proyecto Subido");

              for (let index = 0; index < etiquetas.length; index++) {
                if (!tagsDB.includes(etiquetas[index])){
                  addTags(etiquetas[index])
                }
              }
            }
          }
        } else {
          setAlert('Complete el campo "Descripción"');
          setShowAlert(true);
        }
      } else {
        setAlert('Complete el campo "Titulo"');
        setShowAlert(true);
      }
    } else {
      setAlert("Suba una imagen");
      setShowAlert(true);
    }
  }

  return (
    <div className="newProject">
      <Navbar></Navbar>
      <div className="container my-3">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>
              {" "}
              <span className="shine">[</span> NUEVO PROYECTO{" "}
              <span className="shine">]</span>
            </h1>
          </div>
        </div>
        <div className="row" style={{ marginTop: "-1%" }}>
          <div className="col-lg-6">
            <TextField
              id="standard-basic"
              label="*Título"
              variant="standard"
              fullWidth
              onChange={(e) => setTitulo(e.target.value)}
              value={titulo}
              autoComplete='off'
            />
            <br />
            <br />
            <TextField
              id="standard-multiline-static"
              label="*Descripción"
              variant="standard"
              fullWidth
              autoComplete="off"
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />{" "}
            <br />
            <br />
            <div className="row">
              <div className="col-lg-6">
                <TextField
                  id="standard-select-currency"
                  select
                  label="*Categoría"
                  value={categoria}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                  autoComplete="off"
                >
                  {categorias.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>{" "}
                <br />
              </div>
              <div className="col-lg-6">
                <Tags></Tags>
                <br />
              </div>
            </div>{" "}
            <FormControlLabel
              control={<Checkbox />}
              label="Vender"
              checked={vender}
              onChange={(e) => setVender(!vender)}
            />
            {vender ? (
              <div className="row">
                <div className="col-lg-6 d-flex justify-content-between align-items-end">
                  <h6>$</h6>
                  <TextField
                    type="number"
                    id="standard-basic"
                    label="*Precio"
                    variant="standard"
                    autoComplete="off"
                    onChange={(e) => setPrecio(e.target.value)}
                    value={precio}
                  />
                  <h5>
                    <span className="badge badge-secondary">USD</span>
                  </h5>
                  <br />
                  <br />
                </div>
                <p className="text-danger mt-2">
                  **El pago se realizará a través de PayPal asociado a su correo
                  electrónico.
                </p>
              </div>
            ) : (
              <span></span>
            )}
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-5 mt-2 mb-4 text-center">
            <img className="img-fluid" src={foto} alt="" />
            {cargando ? (
              <progress
                style={{ width: "100%" }}
                value={"" + state}
                max="100"
              ></progress>
            ) : (
              <span />
            )}
          </div>
        </div>
        <div className="row mb-4">
          <div className="upload-btn-wrapper">
            <button className="btn">
              <p className="ant-upload-drag-icon" htmlFor="inputGroupFile04">
                <InboxOutlined style={{ fontSize: "xx-large" }} />
              </p>
              <p className="ant-upload-text">
                Haga clic o arrastre el archivo a esta área para subirlo
              </p>
            </button>
            <input type="file" name="myfile" onChange={(e) => onUpload(e)} />
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-lg-12 d-flex justify-content-end">
            <Link to="/home">
              <button className="btn btn-danger px-4 py-2 mr-3" onClick={e => {message.error("Proyecto Cancelado")}}>
                Cancelar
                <i
                  className="bi bi-x-circle ml-2"
                  style={{ fontSize: "medium" }}
                ></i>
              </button>
            </Link>
            <button className="btn btn-info px-4 py-2" onClick={subir}>
              <i
                className="bi bi-upload mr-3"
                style={{ fontSize: "medium" }}
              ></i>
              Subir
            </button>
          </div>
        </div>
      </div>
      <Alerta></Alerta>
      <Footer></Footer>
    </div>
  );
}

export default NewProject;
