// authMiddleware.js
const jwt = require("jsonwebtoken");

// En producción debe estar en .env
const JWT_SECRET = process.env.JWT_SECRET || "claveSecreta";

// FUNCIÓN que valida si el USER está autenticado.
exports.isAuthenticated = (req, res, next) => {
  /* 1. Buscar token en cabecera Authorization:
     Si authHeader existe, entonces ejecuta authHeader.split(" ")[1].
     Si authHeader NO existe, token será undefined.
     
     Forma 1: Más explícita y clara:
     const token = req.headers["authorization"]?.split(" ")[1];

     if (!token) return res.status(401).json({ message: "Token requerido" });

     Forma 2: Más rápida y económica:
     const authHeader = req.headers["authorization"];
     const token = authHeader && authHeader.split(" ")[1]; // Toma lo que viene después de "Bearer"

     El backend lee el header HTTP llamado Authorization.
     Authorization: Bearer abc123xyz
     Entonces: authHeader = "Bearer abc123xyz";

     "Bearer abc123xyz".split(" ");

     Resultado: ["Bearer", "abc123xyz"]

     ["Bearer", "abc123xyz"][1]  // Escoge la cadena en la posición 1 -> "abc123xyz"
  */
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // toma lo que viene después de "Bearer"

  try {
    // 2. Verifica si el token es válido:
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Guardar los datos del usuario en req.user (id, rol)
    req.user = decoded;

    // 4. Pasar a la siguiente función (la ruta o el siguiente middleware) en la cadena del ENDPOINT.
    next();
    
  } catch (err) {
    console.error("Error verificando token:", err.message);
    res.status(401).json({ message: "Token inválido", error: err.message });
  }
};

// FUNCIÓN que valida si el USER autenticado es ADMIN.
exports.isAdmin = (req, res, next) => {
  // 5. Revisar si el rol del usuario autenticado es admin
  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  // 6. Si sí es admin, continuar a la siguiente función en la cadena del ENDPOINT.
  next();
};
