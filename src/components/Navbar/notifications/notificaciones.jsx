import React, { useEffect, useRef, useState } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "./notifications.css";
import { Overlay, Popover } from "react-bootstrap";
import { useUsuario } from "../../../context/UserContext";
import { getNotification, actualizarLeido } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const { usuario } = useUsuario();
  const [notificaciones, setNotificaciones] = useState([]);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const [leidos, setLeidos] = useState(true);
  let navigate = useNavigate();

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  async function actualizar(uid, id, index) {
    await actualizarLeido(uid, index);
    await getNotification(usuario.uid).then((res) => {
      let array = res.reverse();
      setNotificaciones(array);
      setLeidos(true);
      res.forEach((element) => {
        if (!element.leido & (res[index] !== element)) {
          setLeidos(false);
        }
      });
    });
    navigate("/project/" + id);
  }

  useEffect(() => {
    getNotification(usuario.uid).then((res) => {
      let array = res.reverse();
      setNotificaciones(array);
      res.forEach((element) => {
        if (!element.leido) {
          setLeidos(false);
        }
      });
    });
  }, [usuario, notificaciones]);

  return (
    <div className="notificaciones" ref={ref}>
      <div onClick={handleClick} className="link" activeClassName="active">
        {leidos ? (
          <i class="bi bi-bell-fill"></i>
        ) : (
          <NotificationsActiveIcon
            fontSize="small"
            sx={{ mr: "5px", mt: "-5px" }}
          />
        )}
        Notificaciones
      </div>

      <Overlay
        show={show}
        target={target}
        placement="bottom-end"
        container={ref}
      >
        <Popover id="popover-contained">
          <Popover.Body className="list">
            {notificaciones.map((notification, index) => {
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    actualizar(
                      usuario.uid,
                      notification.proyecto.id,
                      notification.id
                    );
                  }}
                  className={`${
                    !notification.leido ? "noread" : ""
                  } tarjeta my-3 p-2`}
                >
                  Tu Proyecto{" "}
                  <strong>{notification.proyecto.datos.titulo}</strong> recibió
                  un nuevo <strong>{notification.tipo}</strong> de{" "}
                  <strong>{notification.user.displayName}</strong>!
                </div>
              );
            })}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default Notifications;
