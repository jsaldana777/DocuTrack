// Librería de encriptación
const bcrypt = require("bcryptjs");

// Llamado para crear la BBDD
const db = require("../db");

// Creando instancia de la librería para cifrados
const jwt = require("jsonwebtoken");

// Secret JWT (en producción usar .env)
const JWT_SECRET = "claveSecreta";


// FUNCIÓN REGISTRAR USUARIOS:
exports.register = (req, res) => {
    // 1. Extraemos los datos que el usuario manda desde el frontend o Postman
    const { nombre, apellido, cedula, email, password, rol } = req.body;

    // 2. Validar que todos los campos requeridos existen
    if (!nombre || !apellido || !cedula || !email || !password) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // 3. Encriptar la contraseña antes de guardarla
    const passwordHash = bcrypt.hashSync(password, 8);

    // 4. Insertar en la base de datos (con placeholders ? para evitar inyección SQL)
    db.run(
        `INSERT INTO users (nombre, apellido, cedula, email, password, rol) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, cedula, email, passwordHash, rol || "USER"], // si no manda rol, será USER
        function (err) {
            // 5. Manejo de errores
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({ mensaje: "Email o cédula ya registrados" });
                }
                return res.status(500).json({ mensaje: "Error en el servidor", error: err.message });
            }

            // 6. Respuesta al frontend/Postman
            res.status(201).json({
                mensaje: "Usuario registrado con éxito",
                usuario: { id: this.lastID, nombre, apellido, cedula, email, rol: rol || "USER" }
            });
        }
    );
};


// FUNCIÓN LOGIN DE USUARIOS:
// ESTA FUNCIÓN NOS GENERARÁ UN TOKEN
// LO VAMOS A DECODIFICAR PARA LUEGO MANEJARLO EN EL FRONTEND
// Creando la función para llamar los datos del usuario:
exports.login = (req, res) => {
    // Extrae el email y pass que manda el usuario desde el frontend/postman:
    const {email, password} = req.body;

    // Se verifica que ambos campos traigan datos para poder avanzar:
    if (!email || !password)
        return res.status(400).json({ message: "Faltan datos" });

    // Consultar si existe un usuario, por eso usa GET.
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        
        // Manejo de error de estado del servidor (se cayo el servidor por ejemplo)
        if (err) return res.status(500).json({ mensaje: "Error en el servidor" });

        // Si no encuentra el usuario con ese email se muestra el siguiente mensaje:
        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Validar password recibido del frontend contra el que ya está en BBDD
        // Con bcrypt desencriptamos el password de la BBDD para poder comparar con el que viene del frontend:
        // Guardamos un true o false en password_valida.
        const valid = bcrypt.compareSync(password, user.password);

        // Si es falso se muestra el mensaje:
        if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        // Crear token
        // No es seguro colocar el password dentro de las llaves, lo ponemos afuera de los paréntesis entonces:
        // secreto123 es la contraseña del token
        // Se le incluye tiempo de expiración del token
        const token = jwt.sign(
            { id: user.id, rol: user.rol }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Crear json para mostrar en FrontEnd/Postman, el token cifrado:
        res.json({mensaje: "login exitoso", token});
    });
};

// Ya no es necesario porque cada función se exporta automáticamente desde su declaración.
// module.exports = { login, register };