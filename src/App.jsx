import Inicio from "./components/Inicio/inicio";
import InicioReg from './components/inicioReg/inicio'
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from 'react-router-dom'
import Login from "./components/login/login"
import Usuario from "./components/usuario/usuario";
import Listas from './components/listas/listas'
import Proyecto from './components/projects/project/project'
import NewProject from './components/projects/newProject/newProject'
import Gestion from './components/gestion/gestion'
import UsuarioUID from "./components/usuario/usuarioUID/usuarioUID";

function App() {
  // let storage = localStorage.getItem('storage')
  // storage = JSON.parse(storage)

  return (
    <div className="App">
      <Router>
        <Switch>
              <Route path="/" element={<Inicio></Inicio>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/home" element={<InicioReg></InicioReg>} />
              <Route path="/list" element={<Listas></Listas>} />
              <Route path="/project/:id" element={<Proyecto></Proyecto>} />
              <Route path="/user/:uid" element={<UsuarioUID></UsuarioUID>} />
              <Route path="/new-project" element={<NewProject></NewProject>} />
              <Route path="/admin" element={<Gestion></Gestion>} />
              <Route path="/user" element={<Usuario></Usuario>} />
          </Switch>
        </Router>  
    </div>
  );
}

export default App;
