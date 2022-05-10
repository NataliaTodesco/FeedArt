import React from "react";
import Inicio from "./components/Inicio/inicio";
import InicioReg from "./components/inicioReg/inicio";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate
} from "react-router-dom";
import { useUsuario } from './context/UserContext'
import Login from "./components/login/login";
import Usuario from "./components/usuario/usuario";
import Listas from "./components/listas/listas";
import Proyecto from "./components/projects/project/project";
import NewProject from "./components/projects/newProject/newProject";
import Gestion from "./components/gestion/gestion";
import UsuarioUID from "./components/usuario/usuarioUID/usuarioUID";
import EditProject from "./components/projects/editProject/editProject";
import Shopping from "./components/shopping/shopping";
import Terminos from "./components/footer/t&c"
import Contact from "./components/footer/contact"

function Routes() {
  const { usuario } = useUsuario();

  function PrivateRoutes({ path, element, ...rest }) {
    if (usuario && usuario.uid) {
      return <Route path={path} element={element} {...rest}></Route>;
    } else {
      return <Navigate to="/login" {...rest}></Navigate>;
    }
  }

  function RequireAuth({ children }) {  
    if (!usuario.uid) {
      return <Navigate to="/login" />;
    }
  
    return children;
  }

  return (
    <Router>
      <Switch>
        <Route path="/" element={<Inicio></Inicio>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/home" element={<RequireAuth><InicioReg /></RequireAuth>} />
        <Route path="/list" element={<RequireAuth><Listas /></RequireAuth>} />
        <Route path="/project/:id" element={<RequireAuth><Proyecto /></RequireAuth>} />
        <Route path="/user/:uid" element={<RequireAuth><UsuarioUID /></RequireAuth>} />
        <Route path="/project/edit/:id" element={<RequireAuth><EditProject /></RequireAuth>} />
        <Route path="/new-project" element={<RequireAuth><NewProject /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><Gestion /></RequireAuth>} />
        <Route path="/user" element={<RequireAuth><Usuario /></RequireAuth>} />
        <Route path="/shopping" element={<RequireAuth><Shopping /></RequireAuth>} />
        <Route path="/t&c" element={<Terminos></Terminos>} />
        <Route path="/contact" element={<Contact></Contact>} />
      </Switch>
    </Router>
  );
}

export default Routes;
