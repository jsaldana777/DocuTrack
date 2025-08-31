const db = require("../db");
const path = require("path");

// Configuración de Multer para subir archivos
const multer = require("multer");

const fs = require("fs");

// Crear la carpeta uploads si no existe
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Carpeta donde se guardarán los archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // crea la carpeta uploads en tu proyecto
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Permitir solo PDF o JPG/JPEG
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Solo se permiten PDF o JPG"));
    }
    cb(null, true);
  },
}).array("documentos", 5); // máximo 5 archivos

// Función para solicitar certificado
exports.solicitarCertificado = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ mensaje: err.message });
    }

    const { nombre, apellido, cedula, fechaNacimiento, motivo } = req.body;

    if (!nombre || !apellido || !cedula || !fechaNacimiento) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // Guardar los nombres de los archivos subidos
    console.log("Body recibido:", req.body);
    console.log("Archivos recibidos:", req.files);
    // const archivos = req.files.map((file) => file.filename);
    const archivos = req.files ? req.files.map((file) => file.filename) : [];

    // user_id viene del token JWT que se decodifica en el middleware isAuthenticated
    const user_id = req.user.id;

    db.run(
      `INSERT INTO certificados (user_id, nombre, apellido, cedula, fechaNacimiento, motivo, archivos, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, nombre, apellido, cedula, fechaNacimiento, motivo || "", JSON.stringify(archivos), "Recibido"],
      function (err) {
        if (err) {
          return res.status(500).json({ mensaje: "Error al guardar la solicitud", error: err.message });
        }

        res.status(201).json({
          mensaje: "Solicitud recibida",
          solicitud: {
            id: this.lastID,
            estado: "Recibido",
            user_id,
          },
        });
      }
    );
  });
};


// -------------------------------------------------------------------------------------------------------------------------------------
// 2. Ver estado
exports.verEstado = (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM certificados WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error al obtener estado" });
    res.json(rows);
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------
// 3. Descargar certificado
exports.descargarCertificado = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(
    "SELECT * FROM certificados WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, cert) => {
      if (!cert) return res.status(404).json({ message: "No encontrado" });
      if (cert.estado !== "Emitido")
        return res.status(403).json({ message: "Certificado no disponible" });

      res.json({ message: "Aquí va el PDF", certificado: cert });
    }
  );
};
