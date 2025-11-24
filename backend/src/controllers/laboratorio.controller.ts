/**
 * ============================================
 * LABORATORIO CONTROLLER
 * ============================================
 * Controlador para endpoints de laboratorios
 */

import { Request, Response } from 'express';
import { LaboratorioService } from '../services/laboratorio.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { CreateLaboratorioDto, Laboratorio } from '../types';

export class LaboratorioController {
  /**
   * GET /api/laboratorios
   * Obtener todos los laboratorios
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const laboratorios = await LaboratorioService.getAll();

    sendSuccess(res, laboratorios, 'Laboratorios obtenidos exitosamente');
  });

  /**
   * GET /api/laboratorios/:id
   * Obtener un laboratorio por ID con estadísticas
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const laboratorio = await LaboratorioService.getById(id);

    sendSuccess(res, laboratorio, 'Laboratorio obtenido exitosamente');
  });

  /**
   * POST /api/laboratorios
   * Crear un nuevo laboratorio
   * Requiere autenticación de administrador
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const laboratorioData: CreateLaboratorioDto = req.body;

    const result = await LaboratorioService.create(laboratorioData);

    sendCreated(res, { id: result.id }, result.message);
  });

  /**
   * PUT /api/laboratorios/:id
   * Actualizar un laboratorio
   * Requiere autenticación de administrador
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updateData: Partial<Omit<Laboratorio, 'id_laboratorio'>> = req.body;

    const result = await LaboratorioService.update(id, updateData);

    sendSuccess(res, null, result.message);
  });

  /**
   * DELETE /api/laboratorios/:id
   * Eliminar un laboratorio
   * Requiere autenticación de administrador
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const result = await LaboratorioService.delete(id);

    sendSuccess(res, null, result.message);
  });

  /**
   * GET /api/laboratorios/search
   * Buscar laboratorios por nombre
   */
  static searchByName = asyncHandler(async (req: Request, res: Response) => {
    const name = req.query.q as string;

    const laboratorios = await LaboratorioService.searchByName(name);

    sendSuccess(res, laboratorios, 'Búsqueda completada exitosamente');
  });

  /**
   * GET /api/laboratorios/:id/stats
   * Obtener estadísticas de un laboratorio
   */
  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const stats = await LaboratorioService.getStats(id);

    sendSuccess(res, stats, 'Estadísticas obtenidas exitosamente');
  });

  /**
   * GET /api/laboratorios/top
   * Obtener laboratorios con más productos
   */
  static getTopLaboratorios = asyncHandler(
    async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 10;

      const laboratorios = await LaboratorioService.getTopLaboratorios(limit);

      sendSuccess(
        res,
        laboratorios,
        'Top laboratorios obtenidos exitosamente'
      );
    }
  );
}