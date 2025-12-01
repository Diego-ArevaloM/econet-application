/**
 * ============================================
 * RESEÑA MODEL
 * ============================================
 * Modelo para operaciones CRUD de reseñas
 * Tablas: resenas, calificaciones
 */

import pool, { db } from '../config/database';
import { Resena, CreateResenaDto, UpdateResenaDto } from '../types';

export class ResenaModel {
/**
 * Crear reseña y actualizar calificaciones agregadas
 * Usa transacción para consistencia
 */
static async create(resena: CreateResenaDto): Promise<number> {
  return await db.transaction(async (client) => {
    // 1. Insertar reseña
    const resenaResult = await client.query<{ id_resena: number }>(
      `INSERT INTO resenas 
       (id_usuario, id_producto, descripcion, cat_efectividad, 
        cat_valor_precio, cat_facilidad_uso, cat_calidad, satisfaccion_general)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id_resena`,
      [
        resena.id_usuario,
        resena.id_producto,
        resena.descripcion,
        resena.cat_efectividad,
        resena.cat_valor_precio,
        resena.cat_facilidad_uso,
        resena.cat_calidad,
        resena.satisfaccion_general, // ← NUEVO
      ]
    );

    const resenaId = resenaResult.rows[0].id_resena;

    // 2. Actualizar o insertar calificaciones agregadas
    await client.query(
      `INSERT INTO calificaciones 
       (id_producto, sum_a_nota_efectividad, sum_a_nota_precio, 
        sum_a_facilidad_uso, sum_a_calidad, cantidad_resenas)
       VALUES ($1, $2, $3, $4, $5, 1)
       ON CONFLICT (id_producto)
       DO UPDATE SET
         sum_a_nota_efectividad = calificaciones.sum_a_nota_efectividad + $2,
         sum_a_nota_precio = calificaciones.sum_a_nota_precio + $3,
         sum_a_facilidad_uso = calificaciones.sum_a_facilidad_uso + $4,
         sum_a_calidad = calificaciones.sum_a_calidad + $5,
         cantidad_resenas = calificaciones.cantidad_resenas + 1`,
      [
        resena.id_producto,
        resena.cat_efectividad,
        resena.cat_valor_precio,
        resena.cat_facilidad_uso,
        resena.cat_calidad,
      ]
    );

    return resenaId;
  });
}

    /**
   * Obtener reseñas de un producto con info del usuario
   */
  static async getByProducto(productoId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
        r.*,
        u.nombres,
        u.apellidos,
        CONCAT(u.nombres, ' ', u.apellidos) as nombre_completo
      FROM resenas r
      INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_producto = $1
      ORDER BY r.fecha_resena DESC`,
      [productoId]
    );

    return result.rows;
  }

  /**
   * Obtener reseñas de un usuario
   */
  static async getByUsuario(usuarioId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         r.*,
         p.descripcion as producto_descripcion,
         p.tipo as producto_tipo,
         p.imagen_url as producto_imagen,
         l.nombre_laboratorio,
         ROUND(((r.cat_efectividad + r.cat_valor_precio + 
                 r.cat_facilidad_uso + r.cat_calidad) / 4)::numeric, 1) as promedio_individual
       FROM resenas r
       INNER JOIN productos p ON r.id_producto = p.id_producto
       LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio
       WHERE r.id_usuario = $1
       ORDER BY r.fecha_resena DESC`,
      [usuarioId]
    );

    return result.rows;
  }

  /**
   * Obtener reseña por ID
   */
  static async getById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT 
         r.*,
         u.nombres,
         u.apellidos,
         p.descripcion as producto_descripcion
       FROM resenas r
       INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
       INNER JOIN productos p ON r.id_producto = p.id_producto
       WHERE r.id_resena = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Verificar si un usuario ya reseñó un producto
   */
  static async userHasReviewed(usuarioId: number, productoId: number): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(
         SELECT 1 FROM resenas 
         WHERE id_usuario = $1 AND id_producto = $2
       )`,
      [usuarioId, productoId]
    );

    return result.rows[0].exists;
  }

  /**
   * Actualizar reseña
   */
  static async update(id: number, data: UpdateResenaDto, userId: number): Promise<boolean> {
    return await db.transaction(async (client) => {
      // 1. Obtener valores antiguos
      const oldResult = await client.query<{
        cat_efectividad: number;
        cat_valor_precio: number;
        cat_facilidad_uso: number;
        cat_calidad: number;
        id_producto: number;
      }>(
        `SELECT cat_efectividad, cat_valor_precio, cat_facilidad_uso, 
                cat_calidad, id_producto
         FROM resenas
         WHERE id_resena = $1 AND id_usuario = $2`,
        [id, userId]
      );

      if (oldResult.rows.length === 0) return false;

      const oldValues = oldResult.rows[0];

      // 2. Actualizar reseña
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.descripcion !== undefined) {
        fields.push(`descripcion = $${paramCount++}`);
        values.push(data.descripcion);
      }

      if (data.cat_efectividad !== undefined) {
        fields.push(`cat_efectividad = $${paramCount++}`);
        values.push(data.cat_efectividad);
      }

      if (data.cat_valor_precio !== undefined) {
        fields.push(`cat_valor_precio = $${paramCount++}`);
        values.push(data.cat_valor_precio);
      }

      if (data.cat_facilidad_uso !== undefined) {
        fields.push(`cat_facilidad_uso = $${paramCount++}`);
        values.push(data.cat_facilidad_uso);
      }

      if (data.cat_calidad !== undefined) {
        fields.push(`cat_calidad = $${paramCount++}`);
        values.push(data.cat_calidad);
      }

      if (fields.length === 0) return false;

      values.push(id, userId);
      const updateQuery = `
        UPDATE resenas 
        SET ${fields.join(', ')} 
        WHERE id_resena = $${paramCount++} AND id_usuario = $${paramCount}
      `;

      await client.query(updateQuery, values);

      // 3. Actualizar calificaciones agregadas
      const efectividadDiff = (data.cat_efectividad ?? oldValues.cat_efectividad) - oldValues.cat_efectividad;
      const precioDiff = (data.cat_valor_precio ?? oldValues.cat_valor_precio) - oldValues.cat_valor_precio;
      const facilidadDiff = (data.cat_facilidad_uso ?? oldValues.cat_facilidad_uso) - oldValues.cat_facilidad_uso;
      const calidadDiff = (data.cat_calidad ?? oldValues.cat_calidad) - oldValues.cat_calidad;

      await client.query(
        `UPDATE calificaciones
         SET 
           sum_a_nota_efectividad = sum_a_nota_efectividad + $1,
           sum_a_nota_precio = sum_a_nota_precio + $2,
           sum_a_facilidad_uso = sum_a_facilidad_uso + $3,
           sum_a_calidad = sum_a_calidad + $4
         WHERE id_producto = $5`,
        [efectividadDiff, precioDiff, facilidadDiff, calidadDiff, oldValues.id_producto]
      );

      return true;
    });
  }

  /**
   * Eliminar reseña y actualizar calificaciones
   */
  static async delete(id: number, userId: number): Promise<boolean> {
    return await db.transaction(async (client) => {
      // 1. Obtener valores antes de eliminar
      const resenaResult = await client.query<{
        cat_efectividad: number;
        cat_valor_precio: number;
        cat_facilidad_uso: number;
        cat_calidad: number;
        id_producto: number;
      }>(
        `SELECT cat_efectividad, cat_valor_precio, cat_facilidad_uso, 
                cat_calidad, id_producto
         FROM resenas
         WHERE id_resena = $1 AND id_usuario = $2`,
        [id, userId]
      );

      if (resenaResult.rows.length === 0) return false;

      const resena = resenaResult.rows[0];

      // 2. Eliminar reseña
      await client.query(
        `DELETE FROM resenas WHERE id_resena = $1`,
        [id]
      );

      // 3. Actualizar calificaciones agregadas
      await client.query(
        `UPDATE calificaciones
         SET 
           sum_a_nota_efectividad = sum_a_nota_efectividad - $1,
           sum_a_nota_precio = sum_a_nota_precio - $2,
           sum_a_facilidad_uso = sum_a_facilidad_uso - $3,
           sum_a_calidad = sum_a_calidad - $4,
           cantidad_resenas = cantidad_resenas - 1
         WHERE id_producto = $5`,
        [
          resena.cat_efectividad,
          resena.cat_valor_precio,
          resena.cat_facilidad_uso,
          resena.cat_calidad,
          resena.id_producto,
        ]
      );

      return true;
    });
  }

  /**
   * Obtener calificación promedio de un producto
   */
  static async getCalificacionPromedio(productoId: number): Promise<{
    efectividad: number;
    precio: number;
    facilidad_uso: number;
    calidad: number;
    promedio_general: number;
    total_resenas: number;
  }> {
    const result = await pool.query<{
      sum_a_nota_efectividad: string;
      sum_a_nota_precio: string;
      sum_a_facilidad_uso: string;
      sum_a_calidad: string;
      cantidad_resenas: string;
    }>(
      `SELECT 
         COALESCE(sum_a_nota_efectividad, 0) as sum_a_nota_efectividad,
         COALESCE(sum_a_nota_precio, 0) as sum_a_nota_precio,
         COALESCE(sum_a_facilidad_uso, 0) as sum_a_facilidad_uso,
         COALESCE(sum_a_calidad, 0) as sum_a_calidad,
         COALESCE(cantidad_resenas, 0) as cantidad_resenas
       FROM calificaciones
       WHERE id_producto = $1`,
      [productoId]
    );

    if (result.rows.length === 0 || parseInt(result.rows[0].cantidad_resenas) === 0) {
      return {
        efectividad: 0,
        precio: 0,
        facilidad_uso: 0,
        calidad: 0,
        promedio_general: 0,
        total_resenas: 0,
      };
    }

    const data = result.rows[0];
    const cantidad = parseInt(data.cantidad_resenas);

    const efectividad = parseFloat(data.sum_a_nota_efectividad) / cantidad;
    const precio = parseFloat(data.sum_a_nota_precio) / cantidad;
    const facilidad = parseFloat(data.sum_a_facilidad_uso) / cantidad;
    const calidad = parseFloat(data.sum_a_calidad) / cantidad;

    return {
      efectividad: Math.round(efectividad * 10) / 10,
      precio: Math.round(precio * 10) / 10,
      facilidad_uso: Math.round(facilidad * 10) / 10,
      calidad: Math.round(calidad * 10) / 10,
      promedio_general: Math.round(((efectividad + precio + facilidad + calidad) / 4) * 10) / 10,
      total_resenas: cantidad,
    };
  }

  /**
   * Contar reseñas totales
   */
  static async count(): Promise<number> {
    const result = await pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM resenas`
    );

    return parseInt(result.rows[0].count, 10);
  }
}