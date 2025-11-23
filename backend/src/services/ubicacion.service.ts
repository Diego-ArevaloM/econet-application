/**
 * ============================================
 * UBICACION SERVICE
 * ============================================
 * Lógica de negocio para ubicaciones (departamentos, provincias, distritos)
 */

import { UbicacionModel } from '../models/ubicacion.model';
import { Departamento, Provincia, Distrito } from '../types';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { isNotEmpty } from '../utils/validators';

export class UbicacionService {
  // ============================================
  // DEPARTAMENTOS
  // ============================================

  /**
   * Obtener todos los departamentos
   */
  static async getAllDepartamentos(): Promise<Departamento[]> {
    return await UbicacionModel.getAllDepartamentos();
  }

  /**
   * Obtener departamento por ID
   */
  static async getDepartamentoById(id: number): Promise<Departamento> {
    const departamento = await UbicacionModel.getDepartamentoById(id);

    if (!departamento) {
      throw new NotFoundError('Departamento no encontrado');
    }

    return departamento;
  }

  /**
   * Crear departamento (solo admin)
   */
  static async createDepartamento(nombre: string): Promise<{
    id: number;
    message: string;
  }> {
    if (!isNotEmpty(nombre)) {
      throw new BadRequestError('El nombre del departamento es requerido');
    }

    if (nombre.length > 60) {
      throw new BadRequestError('El nombre no puede exceder 60 caracteres');
    }

    const id = await UbicacionModel.createDepartamento(nombre.trim());

    return {
      id,
      message: 'Departamento creado exitosamente',
    };
  }

  // ============================================
  // PROVINCIAS
  // ============================================

  /**
   * Obtener todas las provincias
   */
  static async getAllProvincias(): Promise<any[]> {
    return await UbicacionModel.getAllProvincias();
  }

  /**
   * Obtener provincias por departamento
   */
  static async getProvinciasByDepartamento(departamentoId: number): Promise<Provincia[]> {
    // Verificar que el departamento existe
    const departamento = await UbicacionModel.getDepartamentoById(departamentoId);
    if (!departamento) {
      throw new NotFoundError('Departamento no encontrado');
    }

    return await UbicacionModel.getProvinciasByDepartamento(departamentoId);
  }

  /**
   * Obtener provincia por ID
   */
  static async getProvinciaById(id: number): Promise<any> {
    const provincia = await UbicacionModel.getProvinciaById(id);

    if (!provincia) {
      throw new NotFoundError('Provincia no encontrada');
    }

    return provincia;
  }

  /**
   * Crear provincia (solo admin)
   */
  static async createProvincia(
    nombre: string,
    departamentoId: number
  ): Promise<{
    id: number;
    message: string;
  }> {
    if (!isNotEmpty(nombre)) {
      throw new BadRequestError('El nombre de la provincia es requerido');
    }

    if (nombre.length > 60) {
      throw new BadRequestError('El nombre no puede exceder 60 caracteres');
    }

    // Verificar que el departamento existe
    const departamento = await UbicacionModel.getDepartamentoById(departamentoId);
    if (!departamento) {
      throw new NotFoundError('Departamento no encontrado');
    }

    const id = await UbicacionModel.createProvincia(nombre.trim(), departamentoId);

    return {
      id,
      message: 'Provincia creada exitosamente',
    };
  }

  // ============================================
  // DISTRITOS
  // ============================================

  /**
   * Obtener todos los distritos
   */
  static async getAllDistritos(): Promise<any[]> {
    return await UbicacionModel.getAllDistritos();
  }

  /**
   * Obtener distritos por provincia
   */
  static async getDistritosByProvincia(provinciaId: number): Promise<Distrito[]> {
    // Verificar que la provincia existe
    const provincia = await UbicacionModel.getProvinciaById(provinciaId);
    if (!provincia) {
      throw new NotFoundError('Provincia no encontrada');
    }

    return await UbicacionModel.getDistritosByProvincia(provinciaId);
  }

  /**
   * Obtener distrito por ID
   */
  static async getDistritoById(id: number): Promise<any> {
    const distrito = await UbicacionModel.getDistritoById(id);

    if (!distrito) {
      throw new NotFoundError('Distrito no encontrado');
    }

    return distrito;
  }

  /**
   * Crear distrito (solo admin)
   */
  static async createDistrito(
    nombre: string,
    provinciaId: number
  ): Promise<{
    id: number;
    message: string;
  }> {
    if (!isNotEmpty(nombre)) {
      throw new BadRequestError('El nombre del distrito es requerido');
    }

    if (nombre.length > 60) {
      throw new BadRequestError('El nombre no puede exceder 60 caracteres');
    }

    // Verificar que la provincia existe
    const provincia = await UbicacionModel.getProvinciaById(provinciaId);
    if (!provincia) {
      throw new NotFoundError('Provincia no encontrada');
    }

    const id = await UbicacionModel.createDistrito(nombre.trim(), provinciaId);

    return {
      id,
      message: 'Distrito creado exitosamente',
    };
  }

  // ============================================
  // BÚSQUEDAS Y UTILIDADES
  // ============================================

  /**
   * Buscar distritos por término de búsqueda
   */
  static async searchDistritos(searchTerm: string): Promise<any[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('El término de búsqueda debe tener al menos 2 caracteres');
    }

    return await UbicacionModel.searchDistritos(searchTerm.trim());
  }

  /**
   * Obtener ubicación completa de un distrito
   */
  static async getUbicacionCompleta(distritoId: number): Promise<{
    distrito: string;
    provincia: string;
    departamento: string;
  }> {
    const ubicacion = await UbicacionModel.getUbicacionCompleta(distritoId);

    if (!ubicacion) {
      throw new NotFoundError('Distrito no encontrado');
    }

    return ubicacion;
  }

  /**
   * Obtener jerarquía completa (todos los niveles)
   * Útil para selectores en cascada
   */
  static async getJerarquiaCompleta(): Promise<{
    departamentos: any[];
  }> {
    const departamentos = await UbicacionModel.getAllDepartamentos();

    const jerarquia = await Promise.all(
      departamentos.map(async (dep) => {
        const provincias = await UbicacionModel.getProvinciasByDepartamento(
          dep.id_departamento!
        );

        const provinciasConDistritos = await Promise.all(
          provincias.map(async (prov) => {
            const distritos = await UbicacionModel.getDistritosByProvincia(
              prov.id_provincia!
            );

            return {
              ...prov,
              distritos,
            };
          })
        );

        return {
          ...dep,
          provincias: provinciasConDistritos,
        };
      })
    );

    return {
      departamentos: jerarquia,
    };
  }

  /**
   * Validar que un distrito pertenece a una provincia y departamento específicos
   */
  static async validateUbicacion(
    distritoId: number,
    provinciaId: number,
    departamentoId: number
  ): Promise<boolean> {
    const distrito = await UbicacionModel.getDistritoById(distritoId);

    if (!distrito) {
      return false;
    }

    return (
      distrito.id_provincia === provinciaId &&
      distrito.id_departamento === departamentoId
    );
  }
}