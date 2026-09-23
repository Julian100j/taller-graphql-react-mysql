import { useState } from 'react';
import FormularioUsuario from './components/FormularioUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import './App.css';

export default function App() {
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  return (
    <main className="contenedor" style={{ padding: '20px' }}>
      <h1>Gestión de usuarios</h1>
      <FormularioUsuario
        usuarioEditar={usuarioEditar}
        alTerminar={() => setUsuarioEditar(null)}
      />
      <hr style={{ margin: '20px 0' }} />
      <ListaUsuarios alEditar={setUsuarioEditar} />
    </main>
  );
}