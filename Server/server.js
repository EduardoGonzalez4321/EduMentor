"use strict";

const path = require('path');
const express = require("express");
const https = require("https");
const fs = require("fs");
const router = require('./controllers/router');
const cors = require('cors');

const app = express();
app.use(express.json());
//const port = 8080;

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // Habilita el intercambio de cookies entre dominios
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Directorio publico para el frontend
app.use(express.static(path.resolve(__dirname, 'public')));

// Rutas
app.use('/api/users', router);

// Ruta de scripts
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

/*
app.get(['/', '/home'], (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
})
*/

// Configuración de SSL
const options = {
  key: fs.readFileSync('certs/key.pem'),      // Reemplaza con la ruta a tu clave privada
  cert: fs.readFileSync('certs/cert.pem'),    // Reemplaza con la ruta a tu certificado
};

// Crear servidor HTTPS
const server = https.createServer(options, app).listen(443);

// Iniciar servidor
//server.listen(port, () => {
  //console.log(`EduMentor API listening on port ${port} with SSL.`);
//});
