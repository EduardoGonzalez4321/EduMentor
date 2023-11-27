"use strict";

const User = require('../models/users');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
let jwt = require('jsonwebtoken');


function createUser(req, res) {

  // Encriptamos password
  const usuario = req.body;

  // Hasheamos la contrasena
  let encryptedPassword = bcrypt.hashSync(usuario._password, 10);

  // Establecemos el nuevo hash
  usuario._password = encryptedPassword;

  // Pasamos la var usuario ya con el hash establecido
  let user = User(usuario);

  user.save().then((user) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`User ${user._name} was created`);
  });

}

// FUNCION DE PRUEBA
/*
function listDatabases(client){
  let databasesList = client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
*/

async function checkData(req, res) {

  // Bandera de retorno para la funcion de login en el lado del servidor apache
  let flag;

  // Nos conectamos a mongo para hacer las consultas
  let mongoDB = 'mongodb+srv://admin:i1s97oeXkWt6AtzL@cluster0.bzzfvvd.mongodb.net/usersDB';
  // Crear una instancia del cliente de MongoDB
  let client = new MongoClient(mongoDB);

  console.log("Antes de conectar");
  // Haremos pruebas de la conexion a Mongo
  try {
    console.log("DENTRO DEL TRY");
    await client.connect();

    const database = client.db();
    const collection = database.collection('users');

    const resultado = await collection.findOne({ _email: req.body.email });

    if (resultado) {
      console.log('Usuario encontrado: ', resultado);
      const match = await bcrypt.compare(req.body.pass, resultado._password);

      if (match) {
        console.log('Las passwords coinciden. Inicio de sesion exitoso.');
        const token = await new Promise((resolve, reject) => {
          jwt.sign(
            {
              uid: resultado._id,
              email: resultado._email,
              role: resultado._role
              // Puedes incluir más información si lo necesitas
            },
            'EduMentorSecretKey',
            { expiresIn: '1h' },
            (err, token) => {
              if (err) {
                reject(err);
              } else {
                resolve(token);
              }
            }
          );
        });
        return token;
      } else {
        console.log('Contrasena incorrecta, Inicio de sesion fallido');
        return 0;
      }
    } else {
      console.log('Usuario no encontrado');
      return 0;
    }
  } catch (error) {
    console.error('Error en la función checkData:', error);
    throw error;
  }
  // Retornamos resultado de la comprobacion para el lado del servidor Apache
  return flag;
}


function verifyToken(token) {
  
  // Recibimos del body el jwt establecido para dejar entrar a la pagina
  let secretKey = 'EduMentorSecretKey';
  console.log("DENTRO DE HANDLER");
  console.log(token);
  console.log(typeof token);

  // Verificamos el token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // El token no es válido
      console.error('Token no válido', err);
      return 0;
    } else {
      // El token es válido
      console.log('Token válido', decoded);
      return 1;
    }
  });

}

exports.createUser = createUser;
exports.checkData = checkData;
exports.verifyToken = verifyToken;
