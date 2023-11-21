"use strict";

// Descomentar hasta que hagamos todo el servidor con node
// const mongoose = require('mongoose');

function createUser() {

    // Alertamos al usuario por los fallos del fetch asincrono a la primera, ya si salen errores despues, ni modo
    alert('Usuario creado con exito!');

   // Sacamos de los values del body todos los valores y encriptamos password
   var nombre = document.querySelector('input[placeholder="Nombre"]').value;
   var correo = document.querySelector('input[placeholder="Correo Electrónico"]').value;
   var password = document.querySelector('input[placeholder="Contraseña"]').value;
   var rol = document.querySelector('input[name="rol"]:checked').value;
   var genero = document.getElementById('genero').value;

   // Creamos objeto de usuario para despues mandarlo a mongo y crear el usuario
   let usuario = new User(nombre, correo, password, rol, genero);
   console.log(JSON.stringify(usuario));

   // Realizamos la solicitud POST al servidor
   fetch('https://127.0.0.1:8080/api/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
          // Puedes añadir más encabezados según sea necesario
      },
      body: JSON.stringify(usuario)
  })
  // Doble then, no se por que, seguro esto causa el error de alertar la creacion de usuario pero que si se haga
  .then(response => {
      // Verificamos si la solicitud fue exitosa
      if (!response.ok) {
          throw new Error('Hubo un problema al crear el usuario.');
      }
      // Manejamos la respuesta del servidor
      return response.json();
  })
  .then(data => {
      // Hacemos algo con la respuesta del servidor
      alert('Usuario creado con éxito!');
      window.location.replace("http://127.0.0.1:80/home.html");
      console.log(data); // Puedes imprimir la respuesta en la consola si es útil
  })
  .catch(error => {
      console.error('Error al crear el usuario:', error);
      // Puedes manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
      alert('Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.');
  });

  window.location.replace("http://127.0.0.1:80/home.html");
}

function loginUser() {

    // Obtenemos los valores del input del login de usuario y mandamos a la api
    // La api debe de validar si el hash calculado y el usuario existen y son correctos
    // Tambien en un futuro, devolver el JWT para mantener las sesiones
    var mail = document.querySelector('input[placeholder="Email"]').value;
    var password = document.querySelector('input[placeholder="Password"]').value;

    let bodyData = {
      email: mail,
      pass: password
    }

    console.log(JSON.stringify(bodyData));

    // Hacemos fetch a la api y en una variable guardamos el response ya sea 1 para correcto el login o 0
    let answer;

    fetch('https://127.0.0.1:8080/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // Puedes agregar otros encabezados según tus necesidades
    },
    body: JSON.stringify(bodyData)
    })
    .then(data => {
      // Maneja la respuesta de la API según tus necesidades
      answer = data;
      console.log(data);
    })
    .catch(error => {
      // Maneja errores de la solicitud
      console.error('Error:', error);
    });
    
}
