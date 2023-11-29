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
   fetch('http://127.0.0.1:8080/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  })
    .then(response => response.text())  // Cambia response.json() a response.text()
    .then(data => {
      alert('Usuario creado con éxito!');
      window.location.replace("http://127.0.0.1:8080/home.html");
      console.log(data);
    })
    .catch(error => {
      console.error('Error al crear el usuario:', error);
      alert('Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.');
    });

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
// Agrega un then para manejar el redireccionamiento
function loginUser() {
  return new Promise((resolve, reject) => {
    try {
      const mail = document.querySelector('input[placeholder="Email"]').value;
      const password = document.querySelector('input[placeholder="Password"]').value;

      fetch('http://127.0.0.1:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mail,
          pass: password,
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.text(); // Almacena el token JWT como una cadena
          } else if (response.status === 401) {
            console.log("ENTRAMOS AL 401");
            return Promise.resolve('0'); // Retorna '0' en caso de fallo (código 401 indica fallo de autenticación)
          } else {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
        })
        .then(data => resolve(data)) // Resuelve con el token JWT en caso de éxito
        .catch(error => reject(error));
    } catch (error) {
      reject(new Error('Error en la solicitud'));
    }
  });
}

// Maneja el evento onclick del botón
async function handleLoginButtonClick() {
  try {
    const flag = await loginUser();
    console.log("DENTRO DEL HANDLER: ", flag);

    // Solo redirige si el inicio de sesión fue exitoso
    if (flag !== '0') {
      setCookie("jwt", flag, 7);
      alert("Inicio de sesión exitoso!");
      window.location.replace('http://127.0.0.1:8080/asesorias.html');
    } else if (flag === '0') {
      // Puedes mostrar un mensaje adicional si el inicio de sesión no fue exitoso
      alert('Inicio de sesión incorrecto!');
    }

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

    const response = await fetch(`http://127.0.0.1:8080/api/users/verifyToken/${jwtCookie}`, {
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
