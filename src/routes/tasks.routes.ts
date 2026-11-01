import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { tasks } from "../db/schema";

export const tasksRouter = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
  description: z.string().max(2000).optional().default("")
}).strict();

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
  completed: z.boolean().optional()
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: "Debes enviar al menos un campo para actualizar"
});

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/tasks — listar todas las tareas
tasksRouter.get("/", async (_req, res, next) => {
  try {
    const result = await db.select().from(tasks).orderBy(tasks.id);
    res.status(200).json(result);
  } catch (error) { next(error); }
});

// GET /api/tasks/:id — consultar una tarea
tasksRouter.get("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "El ID debe ser un entero positivo." });
  try {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!task) return res.status(404).json({ error: "Tarea no encontrada." });
    return res.status(200).json(task);
  } catch (error) { return next(error); }
});

// POST /api/tasks — crear una tarea
tasksRouter.post("/", async (req, res, next) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos.", details: parsed.error.flatten() });
  }
  try {
    const [created] = await db.insert(tasks).values(parsed.data).returning();
    return res.status(201).json(created);
  } catch (error) { return next(error); }
});

// PATCH /api/tasks/:id — actualizar una tarea
tasksRouter.patch("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "El ID debe ser un entero positivo." });
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos.", details: parsed.error.flatten() });
  }
  try {
    const [updated] = await db.update(tasks).set(parsed.data).where(eq(tasks.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Tarea no encontrada." });
    return res.status(200).json(updated);
  } catch (error) { return next(error); }
});

// DELETE /api/tasks/:id — eliminar una tarea
tasksRouter.delete("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "El ID debe ser un entero positivo." });
  try {
    const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    if (!deleted) return res.status(404).json({ error: "Tarea no encontrada." });
    return res.status(200).json({ message: "Tarea eliminada correctamente.", task: deleted });
  } catch (error) { return next(error); }
});
