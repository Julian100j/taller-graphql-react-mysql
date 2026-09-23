import { gql } from '@apollo/client';

export const OBTENER_USUARIOS = gql`
  query ObtenerUsuarios {
    usuarios {
      id
      nombre
      correo
      edad
    }
  }
`;

export const CREAR_USUARIO = gql`
  mutation CrearUsuario($datos: UsuarioInput!) {
    crearUsuario(datos: $datos) {
      id
      nombre
      correo
      edad
    }
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: Int!, $datos: UsuarioInput!) {
    actualizarUsuario(id: $id, datos: $datos) {
      id
      nombre
      correo
      edad
    }
  }
`;

export const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: Int!) {
    eliminarUsuario(id: $id) {
      id
      nombre
    }
  }
`;