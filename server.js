// Importo las rutas
const authRoutes = require("./routes/authRoutes");

// Levantar el servidor en el puerto 3000:
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para JSON:
app.use(express.json());

// Crea la ruta del API:
app.use("/api/auth", authRoutes);

// Enviar un param a la BBDD.
// Respond es lo que se obtiene.
// IMPRIME EL MENSAJE EN PANTALLA, SOLO ES PARA QUE VEAMOS QUE SE PUEDE LEVANTAR EL API, NO TIENE NADA QUE VER CON EL FRONT-END.
app.get('/', (req, res) => {
    res.send('API FUNCIONANDO');
});

// Asignar un puerto para levantar la api.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
