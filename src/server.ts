import "dotenv/config";
import { app } from "./app";
import { pool } from "./db";

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Task Manager API escuchando en http://localhost:${port}`);
});

async function shutdown() {
  console.log("Cerrando servidor...");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
