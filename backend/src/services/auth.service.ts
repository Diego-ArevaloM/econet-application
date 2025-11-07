import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
import { JWT_SECRET } from "../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: "Campos incompletos" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `
      INSERT INTO users (nombre, correo, contraseña)
      VALUES ($1, $2, $3)
      RETURNING id, correo
    `;
    const values = [nombre, correo, hashedPassword];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: result.rows[0]
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body;

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE correo = $1",
      [correo]
    );

    const user = userQuery.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Correo no registrado" });
    }

    const isValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, user: { id: user.id, correo: user.correo } });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error en inicio de sesión" });
  }
};
