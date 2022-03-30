import React from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import { logOut } from '../../firebaseConfig';
import {LogoutOutlined} from '@ant-design/icons'

function Navbar() {
  const navigate = useNavigate();
  
  function log_Out(){
    logOut();
    navigate('/');
    console.log("bandera")
  }
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    // const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    // const handleOpenUserMenu = (event) => {
    //   setAnchorElUser(event.currentTarget);
    // };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    // const handleCloseUserMenu = () => {
    //   setAnchorElUser(null);
    // };


    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
  
  return (   
    <div className='container-fluid'>
      <AppBar position="static" style={{backgroundColor: "transparent", boxShadow: 'none', width: '99%'}}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <img src={logo} className="img-fluid" alt="" />
          </Typography>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/home">
                <i className="bi bi-house-fill"></i> Inicio
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/list">
                <i className="bi bi-list-stars"></i> 
                  Mis Listas
                </NavLink>
                </MenuItem>
                {storage.uid === "qA2c3TwTAKUc9160fsJlMtDSVgl1"? <NavLink className="link" activeClassName="active" to="/admin">
                <MenuItem onClick={handleCloseNavMenu}>
                <i className="bi bi-clipboard-data-fill"></i>
                  Gestión
                </MenuItem>
                </NavLink> : <span></span>}
                <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/new-project">
                  <i className="bi bi-plus-circle-fill"></i> 
                  Nuevo Proyecto
                </NavLink>
                </MenuItem>
                <NavLink className="link d-flex justify-content-center"  to="/user">
                  <Avatar alt="Profile Picture" src={storage.photoURL} />
                </NavLink>
                <button onClick={log_Out} className="btn btn-danger btn-block px-4 mt-3">
                  Salir
                  <i className="bi bi-arrow-bar-right ml-1" style={{fontSize:'medium'}}></i>
                </button>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <img src={logo} className="img-fluid" alt="" />
          </Typography>
          <Box className='mt-3 float-right' sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
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
                {storage.uid === "qA2c3TwTAKUc9160fsJlMtDSVgl1"? <NavLink className="link" activeClassName="active" to="/admin">
                <MenuItem onClick={handleCloseNavMenu}>
                <i className="bi bi-clipboard-data-fill"></i>
                Gestión
                </MenuItem>
                </NavLink> : <span></span>}
                <MenuItem onClick={handleCloseNavMenu}>
                <NavLink className="link" activeClassName="active" to="/new-project">
                  <i className="bi bi-plus-circle-fill"></i>
                  Nuevo Proyecto
                </NavLink>
                </MenuItem>
                <NavLink className="link"  to="/user">
                  <Avatar alt="Profile Picture" src={storage.photoURL} />
                </NavLink>
                <button onClick={log_Out} className="btn btn-danger pl-4 pr-3 ml-4">
                  Salir 
                  <i className="bi bi-arrow-bar-right ml-1" style={{fontSize:'medium'}}></i>
                </button>
          </Box>
          </Container>
        </Toolbar>
      
    </AppBar>
    </div>
  );
}

export default Navbar;