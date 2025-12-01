/**
 * ============================================
 * RESEÑA CONTROLLER
 * ============================================
 * Controlador para endpoints de reseñas
 */

import { Request, Response } from 'express';
import { ResenaService } from '../services/resena.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { CreateResenaDto, UpdateResenaDto } from '../types';

export class ResenaController {
  /**
   * POST /api/resenas
   * Crear una nueva reseña
   * Requiere autenticación
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resenaData: CreateResenaDto = {
      id_usuario: userId,
      id_producto: req.body.id_producto,
      descripcion: req.body.descripcion,
      cat_efectividad: req.body.cat_efectividad,
      cat_valor_precio: req.body.cat_valor_precio,
      cat_facilidad_uso: req.body.cat_facilidad_uso,
      cat_calidad: req.body.cat_calidad,
      satisfaccion_general: req.body.satisfaccion_general,
    };

    const result = await ResenaService.create(resenaData);

    sendCreated(res, { id: result.id }, result.message);
  });

  /**
   * GET /api/resenas/producto/:productoId
   * Obtener reseñas de un producto
   */
  static getByProducto = asyncHandler(async (req: Request, res: Response) => {
    const productoId = parseInt(req.params.productoId);

    const resenas = await ResenaService.getByProducto(productoId);

    sendSuccess(res, resenas, 'Reseñas obtenidas exitosamente');
  });

  /**
   * GET /api/resenas/usuario/:usuarioId
   * Obtener reseñas de un usuario
   */
  static getByUsuario = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = parseInt(req.params.usuarioId);

    const resenas = await ResenaService.getByUsuario(usuarioId);

    sendSuccess(res, resenas, 'Reseñas obtenidas exitosamente');
  });

  /**
   * GET /api/resenas/me
   * Obtener reseñas del usuario autenticado
   * Requiere autenticación
   */
  static getMyResenas = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const resenas = await ResenaService.getByUsuario(userId);

    sendSuccess(res, resenas, 'Tus reseñas obtenidas exitosamente');
  });

  /**
   * GET /api/resenas/:id
   * Obtener una reseña específica
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const resenaId = parseInt(req.params.id);

    const resena = await ResenaService.getById(resenaId);

    sendSuccess(res, resena, 'Reseña obtenida exitosamente');
  });

  /**
   * PUT /api/resenas/:id
   * Actualizar una reseña
   * Requiere autenticación (solo el propietario)
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const resenaId = parseInt(req.params.id);
    const userId = req.user!.id;

    const updateData: UpdateResenaDto = {
      descripcion: req.body.descripcion,
      cat_efectividad: req.body.cat_efectividad,
      cat_valor_precio: req.body.cat_valor_precio,
      cat_facilidad_uso: req.body.cat_facilidad_uso,
      cat_calidad: req.body.cat_calidad,
    };

    const result = await ResenaService.update(resenaId, userId, updateData);

    sendSuccess(res, null, result.message);
  });

  /**
   * DELETE /api/resenas/:id
   * Eliminar una reseña
   * Requiere autenticación (propietario o admin)
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const resenaId = parseInt(req.params.id);
    const userId = req.user!.id;
    const isAdmin = req.user!.tipo === 'administrador';

    const result = await ResenaService.delete(resenaId, userId, isAdmin);

    sendSuccess(res, null, result.message);
  });

  /**
   * GET /api/resenas/producto/:productoId/promedio
   * Obtener calificación promedio de un producto
   */
  static getCalificacionPromedio = asyncHandler(
    async (req: Request, res: Response) => {
      const productoId = parseInt(req.params.productoId);

      const calificacion = await ResenaService.getCalificacionPromedio(productoId);

      sendSuccess(res, calificacion, 'Calificación promedio obtenida exitosamente');
    }
  );

  /**
   * GET /api/resenas/can-review/:productoId
   * Verificar si el usuario puede dejar una reseña
   * Requiere autenticación
   */
  static canUserReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const productoId = parseInt(req.params.productoId);

    const result = await ResenaService.canUserReview(userId, productoId);

    sendSuccess(res, result, 'Verificación completada');
  });

  /**
   * GET /api/resenas/stats
   * Obtener estadísticas de reseñas
   */
  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await ResenaService.getStats();

    sendSuccess(res, stats, 'Estadísticas obtenidas exitosamente');
  });
}