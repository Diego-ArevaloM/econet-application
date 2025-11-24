/**
 * ============================================
 * UBICACION CONTROLLER
 * ============================================
 * Controlador para endpoints de ubicaciones
 */

import { Request, Response } from 'express';
import { UbicacionService } from '../services/ubicacion.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

export class UbicacionController {
  // ============================================
  // DEPARTAMENTOS
  // ============================================

  /**
   * GET /api/ubicaciones/departamentos
   * Obtener todos los departamentos
   */
  static getAllDepartamentos = asyncHandler(
    async (req: Request, res: Response) => {
      const departamentos = await UbicacionService.getAllDepartamentos();

      sendSuccess(res, departamentos, 'Departamentos obtenidos exitosamente');
    }
  );

  /**
   * GET /api/ubicaciones/departamentos/:id
   * Obtener un departamento por ID
   */
  static getDepartamentoById = asyncHandler(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      const departamento = await UbicacionService.getDepartamentoById(id);

      sendSuccess(res, departamento, 'Departamento obtenido exitosamente');
    }
  );

  /**
   * POST /api/ubicaciones/departamentos
   * Crear un departamento
   * Requiere autenticación de administrador
   */
  static createDepartamento = asyncHandler(
    async (req: Request, res: Response) => {
      const { nombre } = req.body;

      const result = await UbicacionService.createDepartamento(nombre);

      sendCreated(res, { id: result.id }, result.message);
    }
  );

  // ============================================
  // PROVINCIAS
  // ============================================

  /**
   * GET /api/ubicaciones/provincias
   * Obtener todas las provincias
   */
  static getAllProvincias = asyncHandler(async (req: Request, res: Response) => {
    const provincias = await UbicacionService.getAllProvincias();

    sendSuccess(res, provincias, 'Provincias obtenidas exitosamente');
  });

  /**
   * GET /api/ubicaciones/departamentos/:departamentoId/provincias
   * Obtener provincias de un departamento
   */
  static getProvinciasByDepartamento = asyncHandler(
    async (req: Request, res: Response) => {
      const departamentoId = parseInt(req.params.departamentoId);

      const provincias = await UbicacionService.getProvinciasByDepartamento(
        departamentoId
      );

      sendSuccess(res, provincias, 'Provincias obtenidas exitosamente');
    }
  );

  /**
   * GET /api/ubicaciones/provincias/:id
   * Obtener una provincia por ID
   */
  static getProvinciaById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const provincia = await UbicacionService.getProvinciaById(id);

    sendSuccess(res, provincia, 'Provincia obtenida exitosamente');
  });

  /**
   * POST /api/ubicaciones/provincias
   * Crear una provincia
   * Requiere autenticación de administrador
   */
  static createProvincia = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, id_departamento } = req.body;

    const result = await UbicacionService.createProvincia(
      nombre,
      id_departamento
    );

    sendCreated(res, { id: result.id }, result.message);
  });

  // ============================================
  // DISTRITOS
  // ============================================

  /**
   * GET /api/ubicaciones/distritos
   * Obtener todos los distritos
   */
  static getAllDistritos = asyncHandler(async (req: Request, res: Response) => {
    const distritos = await UbicacionService.getAllDistritos();

    sendSuccess(res, distritos, 'Distritos obtenidos exitosamente');
  });

  /**
   * GET /api/ubicaciones/provincias/:provinciaId/distritos
   * Obtener distritos de una provincia
   */
  static getDistritosByProvincia = asyncHandler(
    async (req: Request, res: Response) => {
      const provinciaId = parseInt(req.params.provinciaId);

      const distritos = await UbicacionService.getDistritosByProvincia(
        provinciaId
      );

      sendSuccess(res, distritos, 'Distritos obtenidos exitosamente');
    }
  );

  /**
   * GET /api/ubicaciones/distritos/:id
   * Obtener un distrito por ID
   */
  static getDistritoById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const distrito = await UbicacionService.getDistritoById(id);

    sendSuccess(res, distrito, 'Distrito obtenido exitosamente');
  });

  /**
   * POST /api/ubicaciones/distritos
   * Crear un distrito
   * Requiere autenticación de administrador
   */
  static createDistrito = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, id_provincia } = req.body;

    const result = await UbicacionService.createDistrito(nombre, id_provincia);

    sendCreated(res, { id: result.id }, result.message);
  });

  // ============================================
  // BÚSQUEDAS Y UTILIDADES
  // ============================================

  /**
   * GET /api/ubicaciones/distritos/search
   * Buscar distritos
   */
  static searchDistritos = asyncHandler(async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;

    const distritos = await UbicacionService.searchDistritos(searchTerm);

    sendSuccess(res, distritos, 'Búsqueda completada exitosamente');
  });

  /**
   * GET /api/ubicaciones/distritos/:id/completa
   * Obtener ubicación completa de un distrito
   */
  static getUbicacionCompleta = asyncHandler(
    async (req: Request, res: Response) => {
      const distritoId = parseInt(req.params.id);

      const ubicacion = await UbicacionService.getUbicacionCompleta(distritoId);

      sendSuccess(res, ubicacion, 'Ubicación completa obtenida exitosamente');
    }
  );

  /**
   * GET /api/ubicaciones/jerarquia
   * Obtener jerarquía completa (departamentos > provincias > distritos)
   * Útil para selectores en cascada
   */
  static getJerarquiaCompleta = asyncHandler(
    async (req: Request, res: Response) => {
      const jerarquia = await UbicacionService.getJerarquiaCompleta();

      sendSuccess(
        res,
        jerarquia,
        'Jerarquía de ubicaciones obtenida exitosamente'
      );
    }
  );
}