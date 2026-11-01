import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Configura el archivo .env.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon y otros proveedores administrados requieren SSL.
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
