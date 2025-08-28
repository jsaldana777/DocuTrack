// Librería que nos permite trabajar con la BBDD y node js
// Verbose nos permite manejar errores: por si no se puede crear la BBDD, etc temas relacionados a la BBDD.
const sqlite3 = require("sqlite3").verbose();

// Librería de encriptación
const bcrypt = require("bcryptjs");

// Abre la BBDD SQLite certificados_db.db (o la crea si no existe) y te avisa en la consola si la conexión fue exitosa o si hubo un error.
// (err) => Es una función flecha para manejo de errores.
const db = new sqlite3.Database("./certificados_db.db", (err) => {
    if (err) {
        console.error("¡Error al conectar con la BBDD!", err.message);
    } else {
        console.log("¡Conexión con la BBDD exitosa!");
    }
});

/* Ejecuta estas instrucciones una por una en el orden que se las paso.
   Esto es útil porque a veces SQLite intenta correr varias consultas en paralelo,
   pero aquí queremos que primero cree la tabla y después inserte el usuario.
   
   Crea tabla de usuarios si no existe.
   Como una inyección sql
   JavaScript es asincrónico, asi que se necesita que para la BBDD se lea el script secuencialmente sin que se salte nada.

  
  CREATE TABLE:
    Crea la tabla users si no existe ya; si ya existe, no hace nada (evita error).

    Columnas:
    id → número único, se va autoincrementando (1, 2, 3...).
    nombre → texto obligatorio.
    apellido → texto obligatorio.
    cedula → texto obligatorio y único (no puede repetirse).
    email → texto obligatorio y único.
    password → texto obligatorio (se guarda encriptado).
    rol → solo puede ser "USER" o "ADMIN". Si no dices nada al crear el usuario, se pone "USER" por defecto.
    f_actual → se guarda automáticamente la fecha y hora actual cuando se inserta un usuario.
*/
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      cedula TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT CHECK(rol IN ('USER','ADMIN')) NOT NULL DEFAULT 'USER',
      f_actual DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );

  // Insertar un usuario de prueba con contraseña encriptada
  /* INSERT:
      Intenta meter un nuevo usuario en la tabla.
     
     OR IGNORE: significa que si ya existe un usuario con ese email o cedula, no da error, simplemente no lo inserta.
    
     Los ? son valores dinámicos → se reemplazan por el array: */
  const email = "admin@mail.com";
  const password = bcrypt.hashSync("123456", 8);

  db.run(
    `INSERT OR IGNORE INTO users 
      (nombre, apellido, cedula, email, password, rol) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["Admin", "Principal", "123456789", email, password, "ADMIN"],
    (err) => {
      if (!err) {
        console.log("Usuario de prueba listo: admin@mail.com / 123456 (ADMIN)");
      }
    }
  );
});


// 🔥 exportar la conexión para usar en authController.js
module.exports = db;