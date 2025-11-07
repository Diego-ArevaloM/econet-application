import { Pool } from "pg";
import { DATABASE_URL } from "./config/env";

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL conectado a Railway"))
  .catch((err) => console.error("❌ Error DB:", err));
