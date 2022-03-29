import Inicio from "./components/Inicio/inicio";
import InicioReg from './components/inicioReg/inicio'
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from 'react-router-dom'
import Login from "./components/login/login"
import Usuario from "./components/usuario/usuarion";

function App() {
  // let storage = localStorage.getItem('storage')
  // storage = JSON.parse(storage)

  return (
    <div className="App">
      {/* {!storage?  <Router>
        <Switch>
          
        </Switch>
      </Router> : 
      } */}
      <Router>
        <Switch>
              <Route path="/" element={<Inicio></Inicio>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/home" element={<InicioReg></InicioReg>} />
              <Route  path="/list" element={<Inicio></Inicio>} />
              <Route path="/project/:id" element={<Inicio></Inicio>} />
              <Route path="/new-project" element={<Inicio></Inicio>} />
              <Route path="/admin" element={<Inicio></Inicio>} />
              <Route path="/user" element={<Usuario></Usuario>} />
          </Switch>
        </Router>  
    </div>
  );
}

export default App;
