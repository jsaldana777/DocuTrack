const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, "certificados_db.db");

// Crear / abrir la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con la BBDD:", err.message);
  } else {
    console.log("¡Conexión con la BBDD exitosa!");
  }
});

// ============================
// CREAR TABLA USERS
// ============================
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('USER','ADMIN')) NOT NULL DEFAULT 'USER',
    f_actual DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error("Error creando tabla users:", err.message);
  else console.log("Tabla users lista");
});

// ============================
// CREAR TABLA CERTIFICADOS
// ============================
db.run(`
  CREATE TABLE certificados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT NOT NULL,
    fechaNacimiento TEXT NOT NULL,
    motivo TEXT,
    archivos TEXT,
    estado TEXT DEFAULT 'Recibido',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) console.error("Error creando tabla certificados:", err.message);
  else console.log("Tabla certificados lista");
});

module.exports = db;
