// Librería de encriptación
const bcrypt = require("bcryptjs");

// Llamado para crear la BBDD
const db = require("../db");

// Creando instancia de la librería para cifrados
const jwt = require("jsonwebtoken");

// Creando la función para llamar los datos del usuario:
const login = (req, res) => {
    // Extrae el email y pass que manda el usuario desde el frontend/postman:
    const {email, password} = req.body;

    // Consultar si existe un usuario, por eso usa GET.
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        
        // Manejo de error de estado del servidor (se cayo el servidor por ejemplo)
        if (err) return res.status(500).json({ mensaje: "Error en el servidor" });

        // Si no encuentra el usuario con ese email se muestra el mensaje siguiente:
        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Validar password recibido del frontend contra el de la BBDD
        // Con bcrypt desencriptamos el password de la BBDD para poder comparar con el que viene del frontend:
        // Guardamos un true o false en password_valida.
        const password_valida = bcrypt.compareSync(password, user.password);

        // Si es falso se muestra el mensaje:
        if (!password_valida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Crear token
        // No es seguro colocar el password dentro de las llaves, lo ponemos afuera de los paréntesis entonces:
        // secreto123 es la contraseña del token
        const token = jwt.sign({id:user.id, email:user.email}, "secreto123", {
            // Se le incluye tiempo de expiración del token
            expiresIn: "1h",
        });

        // Crear json para mostrar dese Postman, el token cifrado:
        res.json({mensaje: "login exitoso", token});
    });
};

module.exports = { login };