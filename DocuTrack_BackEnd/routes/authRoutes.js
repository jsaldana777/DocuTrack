/* Express es un framework web popular para Node.js que simplifica el desarrollo de aplicaciones del lado del servidor y APIs,
   proporcionando un conjunto de herramientas y características robustas para manejar:
   solicitudes HTTP, enrutamiento, middleware y más. */
const express = require("express");

/* express.Router() es una instancia de un enrutador modular, una "mini-aplicación Express"
   que permite agrupar y organizar grupos de rutas, controladores y middleware. */
const router = express.Router();

// Extraigo la función login y register:
const { register, login } = require("../controllers/authController");

// Ruta para registrar usuarios:
router.post("/register", register);

// La ruta login va a poseer lo que contiene el controller:
// Ruta tipo post para enviar datos
// Cuando se haga un POST en la ruta /login se ejecuta la función login:
// ESTE ES EL ENDPOINT.
router.post("/login", login);

// Exporta el router para usarlo en otro script, como por ejemplo server.js (index.js):
module.exports = router;