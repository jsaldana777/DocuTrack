// Librería que nos permite trabajar co la BBDD y node js
// Verbose nos permite manejar errores: por si no se puede crear, etc temas relacionados a la BBDD.
const sqlite3 = require("sqlite3").verbose();

// Librería de encriptación
const bcrypt = require("bcryptjs");

// Creación con la BBDD
const db = new sqlite3.Database("./certificados_db.db", (err) => {
    if (err) {
        console.error("¡Error al conectar con la BBDD!", err.message);
    } else {
        console.log("¡Conexión con la BBDD exitosa!");
    }
});

// Crear tabla de usuarios si no existe
// como una inyección sql
// serialize es como traducir y también para que haya un orden secuencial
// JavaScript es asincrónico, asi que se necesita que para la BBDD se lea el script secuencialmente sin que se salte nada.
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`
  );

  // Insertar un usuario de prueba con contraseña encriptada
  const email = "test@mail.com";
  const password = bcrypt.hashSync("123456", 8);

  db.run(
    "INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err) => {
      if (!err) console.log("Usuario de prueba listo: test@mail.com / 123456");
    }
  );
});
