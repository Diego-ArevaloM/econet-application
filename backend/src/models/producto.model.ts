/**
 * ============================================
 * PRODUCTO MODEL
 * ============================================
 * Modelo para operaciones CRUD de productos
 * Tablas: productos, imagenes_producto, calificaciones
 */

import pool from '../config/database';
import { Producto, CreateProductoDto, UpdateProductoDto, ProductoFiltros } from '../types';

export class ProductoModel {
  /**
   * Obtener todos los productos con información completa
   * Incluye: laboratorio, calificaciones, promedio
   */
  static async getAll(filtros?: ProductoFiltros): Promise<any[]> {
    let query = `
      SELECT 
        p.*,
        l.nombre_laboratorio,
        l.telefono,
        l.correo_electronico as lab_email,
        l.direccion as lab_direccion,
        c.sum_a_nota_efectividad,
        c.sum_a_nota_precio,
        c.sum_a_facilidad_uso,
        c.sum_a_calidad,
        c.cantidad_resenas,
        CASE 
          WHEN c.cantidad_resenas > 0 THEN
            ROUND(((c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                    c.sum_a_facilidad_uso + c.sum_a_calidad) / 
                   (c.cantidad_resenas * 4))::numeric, 1)
          ELSE 0
        END as promedio_calificacion
      FROM productos p
      LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio
      LEFT JOIN calificaciones c ON p.id_producto = c.id_producto
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Aplicar filtros
    if (filtros?.tipo) {
      query += ` AND p.tipo ILIKE $${paramCount++}`;
      params.push(`%${filtros.tipo}%`);
    }

    if (filtros?.forma) {
      query += ` AND p.forma ILIKE $${paramCount++}`;
      params.push(`%${filtros.forma}%`);
    }

    if (filtros?.objetivo_salud) {
      query += ` AND p.objetivo_salud ILIKE $${paramCount++}`;
      params.push(`%${filtros.objetivo_salud}%`);
    }

    if (filtros?.laboratorio) {
      query += ` AND l.nombre_laboratorio ILIKE $${paramCount++}`;
      params.push(`%${filtros.laboratorio}%`);
    }

    if (filtros?.busqueda) {
      query += ` AND (
        p.descripcion ILIKE $${paramCount} OR
        p.tipo ILIKE $${paramCount} OR
        l.nombre_laboratorio ILIKE $${paramCount}
      )`;
      params.push(`%${filtros.busqueda}%`);
      paramCount++;
    }

    query += ` ORDER BY p.fecha_agregacion DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Obtener producto por ID con información completa
   * Incluye: laboratorio, calificaciones, imágenes
   */
  static async getById(id: number): Promise<any | null> {
    // Obtener producto con info del laboratorio y calificaciones
    const productQuery = `
      SELECT 
        p.*,
        l.nombre_laboratorio,
        l.telefono,
        l.correo_electronico as lab_email,
        l.direccion as lab_direccion,
        d.nombre_distrito,
        prov.nombre_provincia,
        dep.nombre_departamento,
        c.sum_a_nota_efectividad,
        c.sum_a_nota_precio,
        c.sum_a_facilidad_uso,
        c.sum_a_calidad,
        c.cantidad_resenas,
        CASE 
          WHEN c.cantidad_resenas > 0 THEN
            ROUND(((c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                    c.sum_a_facilidad_uso + c.sum_a_calidad) / 
                   (c.cantidad_resenas * 4))::numeric, 1)
          ELSE 0
        END as promedio_calificacion
      FROM productos p
      LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio
      LEFT JOIN distritos d ON l.id_distrito = d.id_distrito
      LEFT JOIN provincias prov ON d.id_provincia = prov.id_provincia
      LEFT JOIN departamentos dep ON prov.id_departamento = dep.id_departamento
      LEFT JOIN calificaciones c ON p.id_producto = c.id_producto
      WHERE p.id_producto = $1
    `;

    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      return null;
    }

    const producto = productResult.rows[0];

    // Obtener imágenes del producto
    const imagenesQuery = `
      SELECT id_imagen, imagen_url, tipo, orden
      FROM imagenes_producto
      WHERE id_producto = $1
      ORDER BY 
        CASE WHEN tipo = 'principal' THEN 0 ELSE 1 END,
        orden
    `;

    const imagenesResult = await pool.query(imagenesQuery, [id]);

    return {
      ...producto,
      imagenes: imagenesResult.rows,
    };
  }

  /**
   * Crear un nuevo producto
   */
  static async create(producto: CreateProductoDto): Promise<number> {
    const result = await pool.query<{ id_producto: number }>(
      `INSERT INTO productos 
       (id_laboratorio, descripcion, tipo, forma, objetivo_salud, solos, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_producto`,
      [
        producto.id_laboratorio,
        producto.descripcion,
        producto.tipo,
        producto.forma,
        producto.objetivo_salud,
        producto.solos,
        producto.imagen_url,
      ]
    );

    return result.rows[0].id_producto;
  }

  /**
   * Actualizar producto
   */
  static async update(id: number, data: UpdateProductoDto): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.descripcion !== undefined) {
      fields.push(`descripcion = $${paramCount++}`);
      values.push(data.descripcion);
    }

    if (data.tipo !== undefined) {
      fields.push(`tipo = $${paramCount++}`);
      values.push(data.tipo);
    }

    if (data.forma !== undefined) {
      fields.push(`forma = $${paramCount++}`);
      values.push(data.forma);
    }

    if (data.objetivo_salud !== undefined) {
      fields.push(`objetivo_salud = $${paramCount++}`);
      values.push(data.objetivo_salud);
    }

    if (data.solos !== undefined) {
      fields.push(`solos = $${paramCount++}`);
      values.push(data.solos);
    }

    if (data.imagen_url !== undefined) {
      fields.push(`imagen_url = $${paramCount++}`);
      values.push(data.imagen_url);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE productos SET ${fields.join(', ')} WHERE id_producto = $${paramCount}`;

    const result = await pool.query(query, values);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Eliminar producto
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM productos WHERE id_producto = $1`,
      [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Verificar si un producto existe
   */
  static async exists(id: number): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM productos WHERE id_producto = $1)`,
      [id]
    );

    return result.rows[0].exists;
  }

  /**
   * Obtener productos por laboratorio
   */
  static async getByLaboratorio(laboratorioId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         p.*,
         c.cantidad_resenas,
         CASE 
           WHEN c.cantidad_resenas > 0 THEN
             ROUND(((c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                     c.sum_a_facilidad_uso + c.sum_a_calidad) / 
                    (c.cantidad_resenas * 4))::numeric, 1)
           ELSE 0
         END as promedio_calificacion
       FROM productos p
       LEFT JOIN calificaciones c ON p.id_producto = c.id_producto
       WHERE p.id_laboratorio = $1
       ORDER BY p.fecha_agregacion DESC`,
      [laboratorioId]
    );

    return result.rows;
  }

  /**
   * Buscar productos (búsqueda full-text)
   */
  static async search(searchTerm: string, limit: number = 20): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         p.*,
         l.nombre_laboratorio,
         c.cantidad_resenas,
         CASE 
           WHEN c.cantidad_resenas > 0 THEN
             ROUND(((c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                     c.sum_a_facilidad_uso + c.sum_a_calidad) / 
                    (c.cantidad_resenas * 4))::numeric, 1)
           ELSE 0
         END as promedio_calificacion
       FROM productos p
       LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio
       LEFT JOIN calificaciones c ON p.id_producto = c.id_producto
       WHERE 
         p.descripcion ILIKE $1 OR
         p.tipo ILIKE $1 OR
         p.forma ILIKE $1 OR
         p.objetivo_salud ILIKE $1 OR
         l.nombre_laboratorio ILIKE $1
       ORDER BY p.fecha_agregacion DESC
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );

    return result.rows;
  }

  /**
   * Obtener productos mejor calificados
   */
  static async getTopRated(limit: number = 10): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         p.*,
         l.nombre_laboratorio,
         c.cantidad_resenas,
         ROUND(((c.sum_a_nota_efectividad + c.sum_a_nota_precio + 
                 c.sum_a_facilidad_uso + c.sum_a_calidad) / 
                (c.cantidad_resenas * 4))::numeric, 1) as promedio_calificacion
       FROM productos p
       LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio
       INNER JOIN calificaciones c ON p.id_producto = c.id_producto
       WHERE c.cantidad_resenas >= 3
       ORDER BY promedio_calificacion DESC, c.cantidad_resenas DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  /**
   * Contar total de productos
   */
  static async count(filtros?: ProductoFiltros): Promise<number> {
    let query = `SELECT COUNT(*) FROM productos p`;
    
    if (filtros?.laboratorio) {
      query += ` LEFT JOIN laboratorios l ON p.id_laboratorio = l.id_laboratorio`;
    }

    query += ` WHERE 1=1`;

    const params: any[] = [];
    let paramCount = 1;

    if (filtros?.tipo) {
      query += ` AND p.tipo ILIKE $${paramCount++}`;
      params.push(`%${filtros.tipo}%`);
    }

    if (filtros?.forma) {
      query += ` AND p.forma ILIKE $${paramCount++}`;
      params.push(`%${filtros.forma}%`);
    }

    if (filtros?.objetivo_salud) {
      query += ` AND p.objetivo_salud ILIKE $${paramCount++}`;
      params.push(`%${filtros.objetivo_salud}%`);
    }

    if (filtros?.laboratorio) {
      query += ` AND l.nombre_laboratorio ILIKE $${paramCount++}`;
      params.push(`%${filtros.laboratorio}%`);
    }

    const result = await pool.query<{ count: string }>(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Agregar imagen a un producto
   */
  static async addImage(
    productoId: number,
    imagenUrl: string,
    tipo: string = 'secundaria',
    orden?: string
  ): Promise<number> {
    const result = await pool.query<{ id_imagen: number }>(
      `INSERT INTO imagenes_producto (id_producto, imagen_url, tipo, orden)
       VALUES ($1, $2, $3, $4)
       RETURNING id_imagen`,
      [productoId, imagenUrl, tipo, orden]
    );

    return result.rows[0].id_imagen;
  }

  /**
   * Obtener imágenes de un producto
   */
  static async getImages(productoId: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT * FROM imagenes_producto 
       WHERE id_producto = $1 
       ORDER BY CASE WHEN tipo = 'principal' THEN 0 ELSE 1 END, orden`,
      [productoId]
    );

    return result.rows;
  }
}