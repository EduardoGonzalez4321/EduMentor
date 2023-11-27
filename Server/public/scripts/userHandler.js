"use strict";

// Descomentar hasta que hagamos todo el servidor con node
// const mongoose = require('mongoose');

function createUser() {

    // Alertamos al usuario por los fallos del fetch asincrono a la primera, ya si salen errores despues, ni modo
    //alert('Usuario creado con exito!');

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
  fetch('https://127.0.0.1/api/users', {
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
    /*
      if (!response.ok) {
          throw new Error('Hubo un problema al crear el usuario.');
      }
      */
      // Manejamos la respuesta del servidor
      return response.json();
  })
  .then(data => {
      // Hacemos algo con la respuesta del servidor
      alert('Usuario creado con éxito!');
    window.location.replace("https://127.0.0.1/home.html");
      console.log(data); // Puedes imprimir la respuesta en la consola si es útil
  })
  .catch(error => {
      console.error('Error al crear el usuario:', error);
      // Puedes manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
      alert('Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.');
  });

  window.location.replace("https://127.0.0.1/home.html");
}

async function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// Agrega un then para manejar el redireccionamiento
function loginUser() {
  return new Promise((resolve, reject) => {
    var mail = document.querySelector('input[placeholder="Email"]').value;
    var password = document.querySelector('input[placeholder="Password"]').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://127.0.0.1:443/api/users/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`Error en la solicitud: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error('Error en la solicitud'));
    };

    let bodyData = JSON.stringify({
      email: mail,
      pass: password
    });

    xhr.send(bodyData);
  });
}

// Maneja el evento onclick del botón
async function handleLoginButtonClick() {
  try {
    let flag = await loginUser();
    console.log(flag);

    // Solo redirige si el inicio de sesión fue exitoso
    /*
    if (flag != 0) {
      // Alertamos que el login es correcto
      alert('Inicio de sesión exitoso!');
      
      // Establecemos el jwtCookie
      // Guardamos el jwt como cookie
      */
      setCookie("jwt", flag, 7);
      
      // Mandamos a asesorias después de que se resuelva la promesa de loginUser
      window.location.replace('https://127.0.0.1/asesorias.html');
    /*
    } else {
      // Puedes mostrar un mensaje adicional si el inicio de sesión no fue exitoso
      alert('Inicio de sesión incorrecto!');
    }
    */

    // Aquí puedes realizar acciones adicionales según la respuesta de la API
  } catch (error) {
    // Maneja errores aquí si es necesario
    alert('Error al iniciar sesión');
    console.error('Error al iniciar sesión:', error);
  }
}

// Aqui haremos la funcion para verificar el token cada vez que estemos dentro del panel
// de asesorias e inscripciones

async function verificarToken() {
  try {
    // Obtener el valor de la cookie "jwt"
    const jwtCookie = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('jwt='))
      .split('=')[1];

    if (!jwtCookie) {
      // Manejar el caso en que la cookie no esté presente
      console.error('Cookie "jwt" no encontrada');
      return;
    }

    const response = await fetch(`https://127.0.0.1/api/users/verifyToken/${jwtCookie}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Puedes agregar otros encabezados según tus necesidades
      },
      // Puedes enviar un cuerpo vacío o algún contenido adicional según tus necesidades
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      // Si la respuesta no es exitosa, redirige o toma alguna acción
      window.location.replace('403.html');
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    window.location.replace('403.html');
  }
}
