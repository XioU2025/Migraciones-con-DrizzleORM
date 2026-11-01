import express, { NextFunction, Request, Response } from "express";
import { tasksRouter } from "./routes/tasks.routes";

export const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Task Manager API funcionando" });
});

app.use("/api/tasks", tasksRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejador centralizado de errores: no expone detalles internos al cliente.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor." });
});
