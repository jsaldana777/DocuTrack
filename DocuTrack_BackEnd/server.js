// Importo los script de /routes:
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// const cors = require("cors");
const db = require("./db");

// Levantar el servidor en el puerto 3000:
const PORT = 3000;

const express = require('express');
const app = express();


// Middleware para JSON:
app.use(express.json());

// Middleware CORS para que se pueda acceder desde el frontend
// app.use(cors());

// Crea las ruta del API:
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/admin", adminRoutes); // AUN NO HE CREADO EL CONTENIDO DEL adminRoutes.js

// Crea la ruta del API:
// app.use("/api/certificate", authRoutes);

// Enviar un param a la BBDD.
// Respond es lo que se obtiene.
// IMPRIME EL MENSAJE EN PANTALLA, SOLO ES PARA QUE VEAMOS QUE SE PUEDE LEVANTAR EL API, NO TIENE NADA QUE VER CON EL FRONT-END.
app.get('/', (req, res) => {
    res.send('API FUNCIONANDO');
});

/* Inicia un servidor web en la aplicación, configurándolo para escuchar en el puerto especificado en PORT. */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
