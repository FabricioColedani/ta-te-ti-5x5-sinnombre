const express = require("express");
const app = express();

app.get("/", (_, res) => {
  res.send("Servidor Ta-Te-Ti 5x5 (4 en raya) funcionando ✔️");
});

// Exportar la app (Vercel la monta automáticamente)
module.exports = app;
