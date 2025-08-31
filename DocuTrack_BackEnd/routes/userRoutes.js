const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

// Usuario solicita un certificado.  Ruta protegida para solicitar certificado.
router.post("/certificados", isAuthenticated, userController.solicitarCertificado);

// Usuario consulta sus solicitudes
// router.get("/certificados", isAuthenticated, userController.verMisCertificados);

// Usuario descarga certificado emitido
// router.get("/certificados/:id/descargar", isAuthenticated, userController.descargarCertificado);

module.exports = router;
