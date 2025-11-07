import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

export const DATABASE_URL = process.env.DATABASE_URL!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.PORT || 4000;
export const FRONTEND_URL = process.env.FRONTEND_URL!;

