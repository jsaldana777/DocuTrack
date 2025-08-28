// Express es un framework de nodejs que nos permite manejar cosas del servidor, por ejemplo manejar rutas:
const express = require("express");

const router = express.Router();

// Extraigo la función login
const { login, register } = require("../controller/authController");

// La ruta login va a poseer lo que contiene el controller:
// Ruta tipo post para enviar datos
// Cuando se haga un POST en la ruta /login se ejecuta la función login:
// ESTE ES EL ENDPOINT.
router.post("/login", login);

// Ruta para registrar usuarios:
router.post("/register", register);

// Exporta el router para usarlo en otro script, como pro ejemplo server.js (index.js):
module.exports = router;