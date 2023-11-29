"use strict";

const router = require('express').Router();
const dataHandler = require('./data_handler');

router.route('/')
  .post(async (req, res) => await dataHandler.createUser(req, res));

// Hacemos ruta de la api /api/users/login para revisar en la base si existe el usuario y checar el hash tambien
// Tendremos que modificar el post para retornar datos al server de PHP
router.route('/login').post(async (req, res) => {
  try {
    // Mandamos al handler los datos y esperamos a que se resuelva la promesa
    let flag = await dataHandler.checkData(req, res);

    if (flag === 0) {
      console.log('Credenciales de inicio de sesión inválidas');
      res.status(401).send('Invalid login credentials');
    } else {
      res.type("text/data");
      res.status(200).send(flag);
    }
  } catch (error) {
    console.error('Error en la función login:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.route('/verifyToken/:token')
  .post((req, res) => {

    // Sacamos el token del body
    let key = req.params.token;
    console.log(key);

    // Mandamos a la funcion verificadora
    let flag = dataHandler.verifyToken(key);

    // ifs para saber si el token es correcto o no
    if (flag == 0 ) {
      console.log('Token invalido');
      res.status(403).send('Invalid token');
    } else {
      res.status(200).send(key);
    }

  });

module.exports = router;
