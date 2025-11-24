/**
 * ============================================
 * USER MODEL
 * ============================================
 * Modelo para operaciones CRUD de usuarios y cuentas
 * Tablas: usuarios, cuentas, administrador
 */

import pool, { db } from '../config/database';
import bcrypt from 'bcrypt';
import { Usuario, CreateUsuarioDto } from '../types';
import { QueryResult } from 'pg';

export class UserModel {
  /**
   * Crear usuario completo (usuario + cuenta)
   * Usa transacción para asegurar consistencia
   */
  static async create(userData: CreateUsuarioDto): Promise<number> {
    return await db.transaction(async (client) => {
      // 1. Insertar usuario
      const userResult = await client.query<{ id_usuario: number }>(
        `INSERT INTO usuarios (nombres, apellidos, correo_electronico, tipo_usuario)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario`,
        [
          userData.nombres,
          userData.apellidos,
          userData.correo_electronico,
          userData.tipo_usuario || 'cliente',
        ]
      );

      const userId = userResult.rows[0].id_usuario;

      // 2. Hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.contrasenia, 10);

      // 3. Insertar cuenta
      await client.query(
        `INSERT INTO cuentas (id_usuario, correo_electronico, contrasenia)
         VALUES ($1, $2, $3)`,
        [userId, userData.correo_electronico, hashedPassword]
      );

      // 4. Si es administrador, crear registro de administrador
      if (userData.tipo_usuario === 'administrador') {
        await client.query(
          `INSERT INTO administrador (id_usuario, permisos)
           VALUES ($1, $2)`,
          [userId, 'all'] // Permisos por defecto
        );
      }

      return userId;
    });
  }

  /**
   * Buscar usuario por email (con contraseña)
   * Usado para login
   */
  static async findByEmail(email: string): Promise<any | null> {
    const result = await pool.query<any>(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.correo_electronico, 
              u.fecha_registro, u.tipo_usuario, c.contrasenia
       FROM usuarios u
       INNER JOIN cuentas c ON u.id_usuario = c.id_usuario
       WHERE u.correo_electronico = $1`,
      [email]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Buscar usuario por ID (sin contraseña)
   */
  static async findById(id: number): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      `SELECT id_usuario, nombres, apellidos, correo_electronico, 
              fecha_registro, tipo_usuario
       FROM usuarios
       WHERE id_usuario = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Verificar si un email ya existe
   */
  static async emailExists(email: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM usuarios WHERE correo_electronico = $1)`,
      [email]
    );

    return result.rows[0].exists;
  }

  /**
   * Verificar contraseña
   */
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Actualizar información del usuario
   */
  static async update(
    id: number,
    data: Partial<Pick<Usuario, 'nombres' | 'apellidos'>>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.nombres) {
      fields.push(`nombres = $${paramCount++}`);
      values.push(data.nombres);
    }

    if (data.apellidos) {
      fields.push(`apellidos = $${paramCount++}`);
      values.push(data.apellidos);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = $${paramCount}`;

    const result = await pool.query(query, values);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Actualizar contraseña
   */
  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      `UPDATE cuentas SET contrasenia = $1 WHERE id_usuario = $2`,
      [hashedPassword, id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Eliminar usuario (cascada: también elimina cuenta)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM usuarios WHERE id_usuario = $1`,
      [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   * Solo para admin
   */
  static async getAll(): Promise<Usuario[]> {
    const result = await pool.query<Usuario>(
      `SELECT id_usuario, nombres, apellidos, correo_electronico, 
              fecha_registro, tipo_usuario
       FROM usuarios
       ORDER BY fecha_registro DESC`
    );

    return result.rows;
  }

  /**
   * Contar total de usuarios
   */
  static async count(): Promise<number> {
    const result = await pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM usuarios`
    );

    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Verificar si un usuario es administrador
   */
  static async isAdmin(userId: number): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM administrador WHERE id_usuario = $1)`,
      [userId]
    );

    return result.rows[0].exists;
  }

  /**
   * Obtener estadísticas del usuario
   * Número de reseñas, productos favoritos, etc.
   */
  static async getStats(userId: number): Promise<{
    total_resenas: number;
    promedio_calificaciones: number;
  }> {
    const result = await pool.query<{
      total_resenas: string;
      promedio_calificaciones: string;
    }>(
      `SELECT 
         COUNT(*) as total_resenas,
         COALESCE(AVG((cat_efectividad + cat_valor_precio + cat_facilidad_uso + cat_calidad) / 4), 0) as promedio_calificaciones
       FROM resenas
       WHERE id_usuario = $1`,
      [userId]
    );

    return {
      total_resenas: parseInt(result.rows[0].total_resenas, 10),
      promedio_calificaciones: parseFloat(result.rows[0].promedio_calificaciones),
    };
  }
}