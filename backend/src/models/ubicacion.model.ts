/**
 * ============================================
 * UBICACION MODEL
 * ============================================
 * Modelo para operaciones de ubicación
 * Tablas: departamentos, provincias, distritos
 */

import pool from '../config/database';
import { Departamento, Provincia, Distrito } from '../types';

export class UbicacionModel {
  // ============================================
  // DEPARTAMENTOS
  // ============================================

  /**
   * Obtener todos los departamentos
   */
  static async getAllDepartamentos(): Promise<Departamento[]> {
    const result = await pool.query<Departamento>(
      `SELECT * FROM departamentos ORDER BY nombre_departamento`
    );

    return result.rows;
  }

  /**
   * Obtener departamento por ID
   */
  static async getDepartamentoById(id: number): Promise<Departamento | null> {
    const result = await pool.query<Departamento>(
      `SELECT * FROM departamentos WHERE id_departamento = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crear departamento
   */
  static async createDepartamento(nombre: string): Promise<number> {
    const result = await pool.query<{ id_departamento: number }>(
      `INSERT INTO departamentos (nombre_departamento) 
       VALUES ($1) 
       RETURNING id_departamento`,
      [nombre]
    );

    return result.rows[0].id_departamento;
  }

  // ============================================
  // PROVINCIAS
  // ============================================

  /**
   * Obtener todas las provincias
   */
  static async getAllProvincias(): Promise<any[]> {
    const result = await pool.query(
      `SELECT p.*, d.nombre_departamento
       FROM provincias p
       INNER JOIN departamentos d ON p.id_departamento = d.id_departamento
       ORDER BY d.nombre_departamento, p.nombre_provincia`
    );

    return result.rows;
  }

  /**
   * Obtener provincias por departamento
   */
  static async getProvinciasByDepartamento(departamentoId: number): Promise<Provincia[]> {
    const result = await pool.query<Provincia>(
      `SELECT * FROM provincias 
       WHERE id_departamento = $1 
       ORDER BY nombre_provincia`,
      [departamentoId]
    );

    return result.rows;
  }

  /**
   * Obtener provincia por ID
   */
  static async getProvinciaById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT p.*, d.nombre_departamento
       FROM provincias p
       INNER JOIN departamentos d ON p.id_departamento = d.id_departamento
       WHERE p.id_provincia = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crear provincia
   */
  static async createProvincia(
    nombre: string,
    departamentoId: number
  ): Promise<number> {
    const result = await pool.query<{ id_provincia: number }>(
      `INSERT INTO provincias (nombre_provincia, id_departamento)
       VALUES ($1, $2)
       RETURNING id_provincia`,
      [nombre, departamentoId]
    );

    return result.rows[0].id_provincia;
  }

  // ============================================
  // DISTRITOS
  // ============================================

  /**
   * Obtener todos los distritos
   */
  static async getAllDistritos(): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         d.*,
         p.nombre_provincia,
         p.id_provincia,
         dep.nombre_departamento,
         dep.id_departamento
       FROM distritos d
       INNER JOIN provincias p ON d.id_provincia = p.id_provincia
       INNER JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       ORDER BY dep.nombre_departamento, p.nombre_provincia, d.nombre_distrito`
    );

    return result.rows;
  }

  /**
   * Obtener distritos por provincia
   */
  static async getDistritosByProvincia(provinciaId: number): Promise<Distrito[]> {
    const result = await pool.query<Distrito>(
      `SELECT * FROM distritos 
       WHERE id_provincia = $1 
       ORDER BY nombre_distrito`,
      [provinciaId]
    );

    return result.rows;
  }

  /**
   * Obtener distrito por ID con ubicación completa
   */
  static async getDistritoById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT 
         d.*,
         p.nombre_provincia,
         p.id_provincia,
         dep.nombre_departamento,
         dep.id_departamento
       FROM distritos d
       INNER JOIN provincias p ON d.id_provincia = p.id_provincia
       INNER JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       WHERE d.id_distrito = $1`,
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Crear distrito
   */
  static async createDistrito(
    nombre: string,
    provinciaId: number
  ): Promise<number> {
    const result = await pool.query<{ id_distrito: number }>(
      `INSERT INTO distritos (nombre_distrito, id_provincia)
       VALUES ($1, $2)
       RETURNING id_distrito`,
      [nombre, provinciaId]
    );

    return result.rows[0].id_distrito;
  }

  // ============================================
  // BÚSQUEDAS Y UTILIDADES
  // ============================================

  /**
   * Buscar distritos por nombre (búsqueda parcial)
   */
  static async searchDistritos(searchTerm: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
         d.*,
         p.nombre_provincia,
         dep.nombre_departamento
       FROM distritos d
       INNER JOIN provincias p ON d.id_provincia = p.id_provincia
       INNER JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       WHERE 
         d.nombre_distrito ILIKE $1 OR
         p.nombre_provincia ILIKE $1 OR
         dep.nombre_departamento ILIKE $1
       ORDER BY dep.nombre_departamento, p.nombre_provincia, d.nombre_distrito
       LIMIT 20`,
      [`%${searchTerm}%`]
    );

    return result.rows;
  }

  /**
   * Obtener ubicación completa por distrito ID
   */
  static async getUbicacionCompleta(distritoId: number): Promise<{
    distrito: string;
    provincia: string;
    departamento: string;
  } | null> {
    const result = await pool.query<{
      nombre_distrito: string;
      nombre_provincia: string;
      nombre_departamento: string;
    }>(
      `SELECT 
         d.nombre_distrito,
         p.nombre_provincia,
         dep.nombre_departamento
       FROM distritos d
       INNER JOIN provincias p ON d.id_provincia = p.id_provincia
       INNER JOIN departamentos dep ON p.id_departamento = dep.id_departamento
       WHERE d.id_distrito = $1`,
      [distritoId]
    );

    if (result.rows.length === 0) return null;

    return {
      distrito: result.rows[0].nombre_distrito,
      provincia: result.rows[0].nombre_provincia,
      departamento: result.rows[0].nombre_departamento,
    };
  }

  /**
   * Verificar si un distrito existe
   */
  static async distritoExists(id: number): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM distritos WHERE id_distrito = $1)`,
      [id]
    );

    return result.rows[0].exists;
  }
}