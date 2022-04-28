import Routes from "./Routes";
import { UsuarioProvider } from './context/UserContext'

function App() {
  return (
    <div className="App">
      <UsuarioProvider>
        <Routes></Routes>
      </UsuarioProvider>
    </div>
  );
}

export default App;
