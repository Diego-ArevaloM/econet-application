/**
 * ============================================
 * LABORATORIO MODEL
 * ============================================
 * Modelo para operaciones CRUD de laboratorios
 * Tabla: laboratorios
 */

import pool from '../config/database';
import { Laboratorio, CreateLaboratorioDto } from '../types';

export class LaboratorioModel {
  /**
   * Obtener todos los laboratorios con ubicación completa
   */
  static async getAll(): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         l.*,
         d.nombre_distrito,
         d.id_distrito,
         p.nombre_provincia,
         p.id_provincia,
         dep.nombre_departamento,
         dep.id_departamento
       FROM laboratorios l
       LEFT JOIN distritos d ON l.id_distrito = d.id_distrito
       LEFT JOIN provincias p ON d.id_provincia = p.id_provincia
       LEFT JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       ORDER BY l.nombre_laboratorio`
    );

    return result.rows;
  }

  /**
   * Obtener laboratorio por ID con ubicación completa
   */
  static async getById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT 
         l.*,
         d.nombre_distrito,
         p.nombre_provincia,
         dep.nombre_departamento
       FROM laboratorios l
       LEFT JOIN distritos d ON l.id_distrito = d.id_distrito
       LEFT JOIN provincias p ON d.id_provincia = p.id_provincia
       LEFT JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       WHERE l.id_laboratorio = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crear laboratorio
   */
  static async create(laboratorio: CreateLaboratorioDto): Promise<number> {
    const result = await pool.query<{ id_laboratorio: number }>(
      `INSERT INTO laboratorios 
       (id_distrito, nombre_laboratorio, direccion, correo_electronico, telefono)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_laboratorio`,
      [
        laboratorio.id_distrito,
        laboratorio.nombre_laboratorio,
        laboratorio.direccion,
        laboratorio.correo_electronico,
        laboratorio.telefono,
      ]
    );

    return result.rows[0].id_laboratorio;
  }

  /**
   * Actualizar laboratorio
   */
  static async update(
    id: number,
    data: Partial<Omit<Laboratorio, 'id_laboratorio'>>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.nombre_laboratorio !== undefined) {
      fields.push(`nombre_laboratorio = $${paramCount++}`);
      values.push(data.nombre_laboratorio);
    }

    if (data.direccion !== undefined) {
      fields.push(`direccion = $${paramCount++}`);
      values.push(data.direccion);
    }

    if (data.correo_electronico !== undefined) {
      fields.push(`correo_electronico = $${paramCount++}`);
      values.push(data.correo_electronico);
    }

    if (data.telefono !== undefined) {
      fields.push(`telefono = $${paramCount++}`);
      values.push(data.telefono);
    }

    if (data.id_distrito !== undefined) {
      fields.push(`id_distrito = $${paramCount++}`);
      values.push(data.id_distrito);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE laboratorios SET ${fields.join(', ')} WHERE id_laboratorio = $${paramCount}`;

    const result = await pool.query(query, values);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Eliminar laboratorio
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM laboratorios WHERE id_laboratorio = $1`,
      [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Verificar si existe un laboratorio
   */
  static async exists(id: number): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM laboratorios WHERE id_laboratorio = $1)`,
      [id]
    );

    return result.rows[0].exists;
  }

  /**
   * Buscar laboratorios por nombre
   */
  static async searchByName(name: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         l.*,
         d.nombre_distrito,
         p.nombre_provincia,
         dep.nombre_departamento
       FROM laboratorios l
       LEFT JOIN distritos d ON l.id_distrito = d.id_distrito
       LEFT JOIN provincias p ON d.id_provincia = p.id_provincia
       LEFT JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       WHERE l.nombre_laboratorio ILIKE $1
       ORDER BY l.nombre_laboratorio`,
      [`%${name}%`]
    );

    return result.rows;
  }

  /**
   * Obtener estadísticas de un laboratorio
   */
  static async getStats(id: number): Promise<{
    total_productos: number;
    total_resenas: number;
    promedio_calificacion: number;
  }> {
    const result = await pool.query<{
      total_productos: string;
      total_resenas: string;
      promedio_calificacion: string;
    }>(
      `SELECT 
         COUNT(DISTINCT p.id_producto) as total_productos,
         COALESCE(SUM(c.cantidad_resenas), 0) as total_resenas,
         COALESCE(
           AVG(
             CASE 
               WHEN c.cantidad_resenas > 0 THEN
                 (c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                  c.sum_a_facilidad_uso + c.sum_a_calidad) / (c.cantidad_resenas * 4)
               ELSE 0
             END
           ), 0
         ) as promedio_calificacion
       FROM laboratorios l
       LEFT JOIN productos p ON l.id_laboratorio = p.id_laboratorio
       LEFT JOIN calificaciones c ON p.id_producto = c.id_producto
       WHERE l.id_laboratorio = $1`,
      [id]
    );

    return {
      total_productos: parseInt(result.rows[0].total_productos),
      total_resenas: parseInt(result.rows[0].total_resenas),
      promedio_calificacion: Math.round(parseFloat(result.rows[0].promedio_calificacion) * 10) / 10,
    };
  }

  /**
   * Contar total de laboratorios
   */
  static async count(): Promise<number> {
    const result = await pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM laboratorios`
    );

    return parseInt(result.rows[0].count, 10);
  }
}