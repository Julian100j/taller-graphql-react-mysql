const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2/promise');

// Conexión a la base de datos MySQL de XAMPP
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Abc123', // Contraseña por defecto de XAMPP (vacía)
  database: 'taller_graphql',
  // port: 3307 // <- Descomenta esta línea solo si cambiaste el puerto a 3307 en XAMPP
});

// Schema de GraphQL
const schema = buildSchema(`
  type Usuario {
    id: Int!
    nombre: String!
    correo: String!
    edad: Int!
  }

  input UsuarioInput {
    nombre: String!
    correo: String!
    edad: Int!
  }

  type Query {
    usuarios: [Usuario]
  }

  type Mutation {
    crearUsuario(datos: UsuarioInput!): Usuario
    actualizarUsuario(id: Int!, datos: UsuarioInput!): Usuario
    eliminarUsuario(id: Int!): Usuario
  }
`);

// Resolvers con consultas SQL a MySQL
const root = {
  usuarios: async () => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  },
  crearUsuario: async ({ datos }) => {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, edad) VALUES (?, ?, ?)',
      [datos.nombre, datos.correo, datos.edad]
    );
    return { id: result.insertId, ...datos };
  },
  actualizarUsuario: async ({ id, datos }) => {
    await pool.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, edad = ? WHERE id = ?',
      [datos.nombre, datos.correo, datos.edad, id]
    );
    return { id, ...datos };
  },
  eliminarUsuario: async ({ id }) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

const app = express();

// Middleware CORS habilitado para comunicación con React
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Backend ejecutándose en http://localhost:4000/graphql');
});