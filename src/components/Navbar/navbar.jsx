import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../img/logoHorizontal.svg";
import "./navbar.css";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsuario } from "../../context/UserContext";
import Notifications from "./notifications/notificaciones";

function Navbar() {
  const navigate = useNavigate();
  const { logOut, usuario, obtenerAdmins } = useUsuario();
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    obtenerAdmins().then(res => {
      setAdmins(res)
    })
  }, [obtenerAdmins]);

  function log_Out() {
    logOut();
    navigate("/");
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div className="container-fluid menu">
      <AppBar
        position="static"
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <img src={logo} className="img-fluid" alt="" />
          </Typography>
          <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <MenuItem
                onClick={handleOpenNavMenu}
                className="link"
                activeClassName="active"
                style={{ color: "rgb(82, 79, 79)" }}
              >
                <MenuIcon sx={{ color: "rgb(82, 79, 79)" }} className="mr-2" />{" "}
                Menú
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu} className="mr-1">
                <Notifications></Notifications>
              </MenuItem>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <NavLink className="link" activeClassName="active" to="/home">
                  <MenuItem onClick={handleCloseNavMenu}>
                    <i className="bi bi-house-fill"></i> Inicio
                  </MenuItem>
                </NavLink>
                <NavLink className="link" activeClassName="active" to="/list">
                  <MenuItem onClick={handleCloseNavMenu}>
                    <i className="bi bi-list-stars"></i>
                    Mis Listas
                  </MenuItem>
                </NavLink>
                <NavLink
                  className="link"
                  activeClassName="active"
                  to="/shopping"
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <i className="bi bi-bag-heart-fill"></i>
                    Compra / Venta
                  </MenuItem>
                </NavLink>
                {admins.includes(usuario.uid) ? (
                  <NavLink
                    className="link"
                    activeClassName="active"
                    to="/admin"
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <i className="bi bi-clipboard-data-fill"></i>
                      Gestión
                    </MenuItem>
                  </NavLink>
                ) : (
                  <span></span>
                )}
                <NavLink
                  className="link"
                  activeClassName="active"
                  to="/new-project"
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <i className="bi bi-plus-circle-fill"></i>
                    Nuevo Proyecto
                  </MenuItem>
                </NavLink>
                <NavLink
                  className="link d-flex justify-content-center"
                  to="/user"
                >
                  <Avatar alt="Profile Picture" src={usuario.photoURL} />
                </NavLink>
                <button
                  onClick={log_Out}
                  className="btn btn-danger btn-block px-4 mt-3"
                >
                  Salir
                  <i
                    className="bi bi-arrow-bar-right ml-1"
                    style={{ fontSize: "medium" }}
                  ></i>
                </button>
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <img src={logo} className="img-fluid" alt="" />
            </Typography>
            <Box
              className="mt-3 float-right"
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/Home">
                  <i className="bi bi-house-fill"></i>
                  Inicio
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/list">
                  <i className="bi bi-list-stars"></i>
                  Mis Listas
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink
                  className="link"
                  activeClassName="active"
                  to="/shopping"
                >
                  <i className="bi bi-bag-heart-fill"></i>
                  Compra / Venta
                </NavLink>
              </MenuItem>
              {admins.includes(usuario.uid) ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <NavLink
                    className="link"
                    activeClassName="active"
                    to="/admin"
                  >
                    <i className="bi bi-clipboard-data-fill"></i>
                    Gestión
                  </NavLink>
                </MenuItem>
              ) : (
                <span></span>
              )}
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink
                  className="link"
                  activeClassName="active"
                  to="/new-project"
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  Nuevo Proyecto
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} className="mr-1">
                <Notifications></Notifications>
              </MenuItem>
              <NavLink className="link" to="/user">
                <Avatar alt="Profile Picture" src={usuario.photoURL} />
              </NavLink>
              <button
                onClick={log_Out}
                className="btn btn-danger pl-4 pr-3 ml-4"
              >
                Salir
                <i
                  className="bi bi-arrow-bar-right ml-1"
                  style={{ fontSize: "medium" }}
                ></i>
              </button>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
