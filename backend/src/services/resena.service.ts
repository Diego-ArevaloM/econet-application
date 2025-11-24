/**
 * ============================================
 * RESEÑA SERVICE
 * ============================================
 * Lógica de negocio para reseñas y calificaciones
 */

import { ResenaModel } from '../models/resena.model';
import { ProductoModel } from '../models/producto.model';
import { CreateResenaDto, UpdateResenaDto } from '../types';
import { 
  BadRequestError, 
  NotFoundError,
  ConflictError,
  ForbiddenError 
} from '../utils/apiError';
import { areValidRatings, isValidLength } from '../utils/validators';
import { VALIDATION_LIMITS } from '../utils/constants';

export class ResenaService {
  /**
   * Crear una nueva reseña
   * Valida que el usuario no haya reseñado antes el mismo producto
   */
  static async create(resenaData: CreateResenaDto): Promise<{
    id: number;
    message: string;
  }> {
    // Validar que el producto existe
    const productoExists = await ProductoModel.exists(resenaData.id_producto);
    if (!productoExists) {
      throw new NotFoundError('El producto especificado no existe');
    }

    // Validar calificaciones
    if (!areValidRatings({
      cat_efectividad: resenaData.cat_efectividad,
      cat_valor_precio: resenaData.cat_valor_precio,
      cat_facilidad_uso: resenaData.cat_facilidad_uso,
      cat_calidad: resenaData.cat_calidad,
    })) {
      throw new BadRequestError('Todas las calificaciones deben estar entre 0 y 5');
    }

    // Verificar que el usuario no haya reseñado antes este producto
    const hasReviewed = await ResenaModel.userHasReviewed(
      resenaData.id_usuario,
      resenaData.id_producto
    );

    if (hasReviewed) {
      throw new ConflictError('Ya has dejado una reseña para este producto');
    }

    // Validar descripción si está presente
    if (resenaData.descripcion) {
      if (!isValidLength(
        resenaData.descripcion,
        VALIDATION_LIMITS.RESENA_MIN_LENGTH,
        VALIDATION_LIMITS.RESENA_MAX_LENGTH
      )) {
        throw new BadRequestError(
          `La descripción debe tener entre ${VALIDATION_LIMITS.RESENA_MIN_LENGTH} y ${VALIDATION_LIMITS.RESENA_MAX_LENGTH} caracteres`
        );
      }
    }

    // Crear reseña (también actualiza calificaciones del producto)
    const resenaId = await ResenaModel.create(resenaData);

    return {
      id: resenaId,
      message: 'Reseña publicada exitosamente',
    };
  }

  /**
   * Obtener reseñas de un producto
   */
  static async getByProducto(productoId: number): Promise<any[]> {
    // Verificar que el producto existe
    const exists = await ProductoModel.exists(productoId);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    return await ResenaModel.getByProducto(productoId);
  }

  /**
   * Obtener reseñas de un usuario
   */
  static async getByUsuario(usuarioId: number): Promise<any[]> {
    return await ResenaModel.getByUsuario(usuarioId);
  }

  /**
   * Obtener una reseña específica
   */
  static async getById(resenaId: number): Promise<any> {
    const resena = await ResenaModel.getById(resenaId);

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    return resena;
  }

  /**
   * Actualizar reseña
   * Solo el propietario puede actualizar su reseña
   */
  static async update(
    resenaId: number,
    userId: number,
    updateData: UpdateResenaDto
  ): Promise<{ message: string }> {
    // Verificar que la reseña existe y pertenece al usuario
    const resena = await ResenaModel.getById(resenaId);

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    if (resena.id_usuario !== userId) {
      throw new ForbiddenError('No tienes permisos para editar esta reseña');
    }

    // Validar calificaciones si se están actualizando
    const newRatings = {
      cat_efectividad: updateData.cat_efectividad ?? resena.cat_efectividad,
      cat_valor_precio: updateData.cat_valor_precio ?? resena.cat_valor_precio,
      cat_facilidad_uso: updateData.cat_facilidad_uso ?? resena.cat_facilidad_uso,
      cat_calidad: updateData.cat_calidad ?? resena.cat_calidad,
    };

    if (!areValidRatings(newRatings)) {
      throw new BadRequestError('Todas las calificaciones deben estar entre 0 y 5');
    }

    // Validar descripción si se está actualizando
    if (updateData.descripcion !== undefined) {
      if (updateData.descripcion && !isValidLength(
        updateData.descripcion,
        VALIDATION_LIMITS.RESENA_MIN_LENGTH,
        VALIDATION_LIMITS.RESENA_MAX_LENGTH
      )) {
        throw new BadRequestError(
          `La descripción debe tener entre ${VALIDATION_LIMITS.RESENA_MIN_LENGTH} y ${VALIDATION_LIMITS.RESENA_MAX_LENGTH} caracteres`
        );
      }
    }

    // Actualizar (también recalcula calificaciones del producto)
    const updated = await ResenaModel.update(resenaId, updateData, userId);

    if (!updated) {
      throw new BadRequestError('No se pudo actualizar la reseña');
    }

    return {
      message: 'Reseña actualizada exitosamente',
    };
  }

  /**
   * Eliminar reseña
   * Solo el propietario o un admin puede eliminar
   */
  static async delete(
    resenaId: number,
    userId: number,
    isAdmin: boolean = false
  ): Promise<{ message: string }> {
    // Verificar que la reseña existe
    const resena = await ResenaModel.getById(resenaId);

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    // Verificar permisos: solo el propietario o admin pueden eliminar
    if (!isAdmin && resena.id_usuario !== userId) {
      throw new ForbiddenError('No tienes permisos para eliminar esta reseña');
    }

    // Eliminar (también actualiza calificaciones del producto)
    const deleted = await ResenaModel.delete(resenaId, resena.id_usuario);

    if (!deleted) {
      throw new BadRequestError('No se pudo eliminar la reseña');
    }

    return {
      message: 'Reseña eliminada exitosamente',
    };
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
    const exists = await ProductoModel.exists(productoId);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    return await ResenaModel.getCalificacionPromedio(productoId);
  }

  /**
   * Verificar si un usuario puede dejar una reseña
   */
  static async canUserReview(
    userId: number,
    productoId: number
  ): Promise<{
    canReview: boolean;
    reason?: string;
  }> {
    // Verificar que el producto existe
    const exists = await ProductoModel.exists(productoId);
    if (!exists) {
      return {
        canReview: false,
        reason: 'El producto no existe',
      };
    }

    // Verificar si ya ha reseñado
    const hasReviewed = await ResenaModel.userHasReviewed(userId, productoId);
    if (hasReviewed) {
      return {
        canReview: false,
        reason: 'Ya has dejado una reseña para este producto',
      };
    }

    return {
      canReview: true,
    };
  }

  /**
   * Obtener estadísticas de reseñas
   */
  static async getStats(): Promise<{
    total_resenas: number;
    promedio_calificacion_global: number;
    distribucion_calificaciones: {
      excelente: number; // 4.5-5
      bueno: number; // 3.5-4.4
      regular: number; // 2.5-3.4
      malo: number; // 1.5-2.4
      muy_malo: number; // 0-1.4
    };
  }> {
    const totalResenas = await ResenaModel.count();

    // Aquí podrías agregar lógica adicional para calcular
    // la distribución de calificaciones consultando la BD

    return {
      total_resenas: totalResenas,
      promedio_calificacion_global: 0, // Calcular según necesidad
      distribucion_calificaciones: {
        excelente: 0,
        bueno: 0,
        regular: 0,
        malo: 0,
        muy_malo: 0,
      },
    };
  }
}