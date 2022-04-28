import React, { useState, useEffect } from "react";
import {
  Avatar as Img,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Comment } from "antd";
import { useNavigate } from "react-router-dom";
import {
  borrarComentario,
  obtenerComentarios,
  registrarComentario,
} from "../../../../firebaseConfig";
import { useUsuario } from '../../../../context/UserContext'

function Comentario({ id }) {
  let navigate = useNavigate();
  const { usuario } = useUsuario()
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [editar, setEditar] = useState(false);
  const [open, setOpen] = React.useState(false);

  function verUsuario(uid) {
    navigate("/user/" + uid);
  }

  function agregarComentario() {
    let coments = comentarios;
    coments.push({
      comentario: comentario,
      uid: usuario.uid,
      nombre: usuario.displayName,
      foto: usuario.photoURL,
    });
    registrarComentario(id, coments);
    obtenerComentarios(id).then((res) => {
      setComentarios(res);
    });
    setComentario("");
  }

  function editarComentario(comentario) {
    setEditar(true);
    setComentario(comentario.comentario);
  }

  function modificar(indice) {
    if (comentario !== "") {
      let coments = comentarios;
      coments[indice].comentario = comentario;
      registrarComentario(id, coments);
      obtenerComentarios(id).then((res) => {
        setComentarios(res);
      });
    } else {
      setOpen(true)
    }
    setEditar(false);
    setComentario("");
  }

  function ResponsiveDialog() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"No se pudo Modificar el Comentario"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              El comentario no pudo ser modificado, asegúrese de no dejar el campo vacío.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  function eliminarComentario(indice) {
    let coments = comentarios;
    coments.splice(indice, 1);
    borrarComentario(id, coments);
    obtenerComentarios(id).then((res) => {
      setComentarios(res);
    });
    setComentario("");
  }

  useEffect(() => {
    obtenerComentarios(id).then((res) => {
      setComentarios(res);
    });
  }, [id]);

  return (
    <div> <ResponsiveDialog></ResponsiveDialog>
      <div className="card card-coment">
        <h4 className="text-center" style={{ color: "white" }}>
          Comentarios
          <i className="bi bi-chat-square-heart ml-3"></i>
        </h4>
        <div className="card comentarios">
          {comentarios.map((_comentario, index) => (
            <Comment
              key={index}
              actions={
                _comentario.uid === usuario.uid && !editar
                  ? [
                      <>
                        <span onClick={(e) => editarComentario(_comentario)}>
                          Editar
                        </span>
                        <span onClick={(e) => eliminarComentario(index)}>
                          Eliminar
                        </span>
                      </>,
                    ]
                  : []
              }
              author={
                <a
                  href="/"
                  onClick={(e) => {
                    verUsuario(_comentario.uid);
                  }}
                >
                  {" "}
                  {_comentario.nombre}{" "}
                </a>
              }
              avatar={
                <Img
                  onClick={(e) => {
                    verUsuario(_comentario.uid);
                  }}
                  src={_comentario.foto}
                  alt="Han Solo"
                />
              }
              content={
                _comentario.uid === usuario.uid && editar ? (
                  <div class="input-group">
                    <textarea
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="Escriba un comentario..."
                      aria-label="Recipient's username with two button addons"
                      aria-describedby="button-addon4"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows="3"
                    />
                    <div class="input-group-append" id="button-addon4">
                      <button
                        class="btn btn-sm btn-outline-success"
                        type="button"
                        onClick={(e) => modificar(index)}
                      >
                        <i
                          class="bi bi-pencil-square"
                          style={{ fontSize: "medium" }}
                        ></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={(e) => {
                          setEditar(false);
                          setComentario("");
                        }}
                      >
                        <i
                          class="bi bi-x-circle-fill"
                          style={{ fontSize: "medium" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{_comentario.comentario}</p>
                )
              }
            />
          ))}
        </div>
        {!editar ? (
          <div className="input-group mt-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un comentario..."
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-dark"
                type="button"
                id="button-addon2"
                onClick={(e) => agregarComentario()}
              >
                <i
                  className="bi bi-send-fill"
                  style={{ fontSize: "medium" }}
                ></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="input-group mt-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un comentario..."
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              disabled
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-dark"
                type="button"
                id="button-addon2"
                disabled
              >
                <i
                  className="bi bi-send-fill"
                  style={{ fontSize: "medium" }}
                ></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comentario;
