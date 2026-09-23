import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREAR_USUARIO, ACTUALIZAR_USUARIO, OBTENER_USUARIOS } from '../graphql/operaciones';

const inicial = { nombre: '', correo: '', edad: '' };

export default function FormularioUsuario({ usuarioEditar, alTerminar }) {
  const [formulario, setFormulario] = useState(inicial);

  // Incluimos refetchQueries para actualizar la tabla automáticamente tras guardar/actualizar
  const opciones = { refetchQueries: [{ query: OBTENER_USUARIOS }] };
  const [crear] = useMutation(CREAR_USUARIO, opciones);
  const [actualizar] = useMutation(ACTUALIZAR_USUARIO, opciones);

  useEffect(() => {
    setFormulario(usuarioEditar ? {
      nombre: usuarioEditar.nombre,
      correo: usuarioEditar.correo,
      edad: usuarioEditar.edad
    } : inicial);
  }, [usuarioEditar]);

  const cambiar = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    const datos = { ...formulario, edad: Number(formulario.edad) };
    if (usuarioEditar) {
      await actualizar({ variables: { id: Number(usuarioEditar.id), datos } });
    } else {
      await crear({ variables: { datos } });
    }
    setFormulario(inicial);
    if (alTerminar) alTerminar();
  };

  return (
    <form onSubmit={guardar}>
      <h2>{usuarioEditar ? 'Editar usuario' : 'Nuevo usuario'}</h2>
      <input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={cambiar} required />
      <input name="correo" type="email" placeholder="Correo" value={formulario.correo} onChange={cambiar} required />
      <input name="edad" type="number" min="1" placeholder="Edad" value={formulario.edad} onChange={cambiar} required />
      <button type="submit">{usuarioEditar ? 'Actualizar' : 'Guardar'}</button>
    </form>
  );
}