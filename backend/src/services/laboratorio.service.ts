/**
 * ============================================
 * LABORATORIO SERVICE
 * ============================================
 * Lógica de negocio para laboratorios
 */

import { LaboratorioModel } from '../models/laboratorio.model';
import { UbicacionModel } from '../models/ubicacion.model';
import { CreateLaboratorioDto, Laboratorio } from '../types';
import { 
  BadRequestError, 
  NotFoundError,
  ConflictError 
} from '../utils/apiError';
import { 
  isValidEmail, 
  isValidPhone, 
  isNotEmpty,
  isValidLength 
} from '../utils/validators';
import { VALIDATION_LIMITS } from '../utils/constants';

export class LaboratorioService {
  /**
   * Obtener todos los laboratorios
   */
  static async getAll(): Promise<any[]> {
    return await LaboratorioModel.getAll();
  }

  /**
   * Obtener laboratorio por ID con información completa
   */
  static async getById(id: number): Promise<any> {
    const laboratorio = await LaboratorioModel.getById(id);

    if (!laboratorio) {
      throw new NotFoundError('Laboratorio no encontrado');
    }

    // Obtener estadísticas del laboratorio
    const stats = await LaboratorioModel.getStats(id);

    return {
      ...laboratorio,
      estadisticas: stats,
    };
  }

  /**
   * Crear un nuevo laboratorio
   * Solo administradores
   */
  static async create(laboratorioData: CreateLaboratorioDto): Promise<{
    id: number;
    message: string;
  }> {
    // Validar que el distrito existe
    const distritoExists = await UbicacionModel.distritoExists(laboratorioData.id_distrito);
    if (!distritoExists) {
      throw new NotFoundError('El distrito especificado no existe');
    }

    // Validar nombre
    if (!isValidLength(
      laboratorioData.nombre_laboratorio,
      VALIDATION_LIMITS.LAB_NOMBRE_MIN_LENGTH,
      VALIDATION_LIMITS.LAB_NOMBRE_MAX_LENGTH
    )) {
      throw new BadRequestError(
        `El nombre debe tener entre ${VALIDATION_LIMITS.LAB_NOMBRE_MIN_LENGTH} y ${VALIDATION_LIMITS.LAB_NOMBRE_MAX_LENGTH} caracteres`
      );
    }

    // Validar email
    if (!isValidEmail(laboratorioData.correo_electronico)) {
      throw new BadRequestError('El formato del email es inválido');
    }

    // Validar teléfono
    if (!isValidPhone(laboratorioData.telefono)) {
      throw new BadRequestError('El formato del teléfono es inválido');
    }

    // Validar dirección
    if (!isNotEmpty(laboratorioData.direccion)) {
      throw new BadRequestError('La dirección es requerida');
    }

    if (laboratorioData.direccion.length > VALIDATION_LIMITS.LAB_DIRECCION_MAX_LENGTH) {
      throw new BadRequestError(
        `La dirección no puede exceder ${VALIDATION_LIMITS.LAB_DIRECCION_MAX_LENGTH} caracteres`
      );
    }

    // Crear laboratorio
    const laboratorioId = await LaboratorioModel.create(laboratorioData);

    return {
      id: laboratorioId,
      message: 'Laboratorio creado exitosamente',
    };
  }

  /**
   * Actualizar laboratorio
   * Solo administradores
   */
  static async update(
    id: number,
    updateData: Partial<Omit<Laboratorio, 'id_laboratorio'>>
  ): Promise<{ message: string }> {
    // Verificar que el laboratorio existe
    const exists = await LaboratorioModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Laboratorio no encontrado');
    }

    // Validar distrito si se está actualizando
    if (updateData.id_distrito) {
      const distritoExists = await UbicacionModel.distritoExists(updateData.id_distrito);
      if (!distritoExists) {
        throw new NotFoundError('El distrito especificado no existe');
      }
    }

    // Validar nombre si se está actualizando
    if (updateData.nombre_laboratorio) {
      if (!isValidLength(
        updateData.nombre_laboratorio,
        VALIDATION_LIMITS.LAB_NOMBRE_MIN_LENGTH,
        VALIDATION_LIMITS.LAB_NOMBRE_MAX_LENGTH
      )) {
        throw new BadRequestError(
          `El nombre debe tener entre ${VALIDATION_LIMITS.LAB_NOMBRE_MIN_LENGTH} y ${VALIDATION_LIMITS.LAB_NOMBRE_MAX_LENGTH} caracteres`
        );
      }
    }

    // Validar email si se está actualizando
    if (updateData.correo_electronico) {
      if (!isValidEmail(updateData.correo_electronico)) {
        throw new BadRequestError('El formato del email es inválido');
      }
    }

    // Validar teléfono si se está actualizando
    if (updateData.telefono) {
      if (!isValidPhone(updateData.telefono)) {
        throw new BadRequestError('El formato del teléfono es inválido');
      }
    }

    // Actualizar
    const updated = await LaboratorioModel.update(id, updateData);

    if (!updated) {
      throw new BadRequestError('No se pudo actualizar el laboratorio');
    }

    return {
      message: 'Laboratorio actualizado exitosamente',
    };
  }

  /**
   * Eliminar laboratorio
   * Solo administradores
   * No se puede eliminar si tiene productos asociados
   */
  static async delete(id: number): Promise<{ message: string }> {
    // Verificar que el laboratorio existe
    const exists = await LaboratorioModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Laboratorio no encontrado');
    }

    // Verificar que no tenga productos asociados
    const stats = await LaboratorioModel.getStats(id);
    if (stats.total_productos > 0) {
      throw new ConflictError(
        `No se puede eliminar el laboratorio porque tiene ${stats.total_productos} productos asociados`
      );
    }

    await LaboratorioModel.delete(id);

    return {
      message: 'Laboratorio eliminado exitosamente',
    };
  }

  /**
   * Buscar laboratorios por nombre
   */
  static async searchByName(name: string): Promise<any[]> {
    if (!name || name.trim().length < 2) {
      throw new BadRequestError('El término de búsqueda debe tener al menos 2 caracteres');
    }

    return await LaboratorioModel.searchByName(name.trim());
  }

  /**
   * Obtener estadísticas de un laboratorio
   */
  static async getStats(id: number): Promise<{
    laboratorio: any;
    estadisticas: {
      total_productos: number;
      total_resenas: number;
      promedio_calificacion: number;
    };
  }> {
    const laboratorio = await LaboratorioModel.getById(id);

    if (!laboratorio) {
      throw new NotFoundError('Laboratorio no encontrado');
    }

    const stats = await LaboratorioModel.getStats(id);

    return {
      laboratorio,
      estadisticas: stats,
    };
  }

  /**
   * Obtener laboratorios con más productos
   */
  static async getTopLaboratorios(limit: number = 10): Promise<any[]> {
    if (limit < 1 || limit > 50) {
      limit = 10;
    }

    const laboratorios = await LaboratorioModel.getAll();

    // Obtener estadísticas de cada laboratorio
    const laboratoriosConStats = await Promise.all(
      laboratorios.map(async (lab) => {
        const stats = await LaboratorioModel.getStats(lab.id_laboratorio);
        return {
          ...lab,
          ...stats,
        };
      })
    );

    // Ordenar por total de productos
    laboratoriosConStats.sort((a, b) => b.total_productos - a.total_productos);

    return laboratoriosConStats.slice(0, limit);
  }
}