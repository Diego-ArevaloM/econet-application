/**
 * ============================================
 * UBICACION ROUTES
 * ============================================
 * Rutas para gestión de ubicaciones (departamentos, provincias, distritos)
 */

import { Router } from 'express';
import { UbicacionController } from '../controllers/ubicacion.controller';
import { 
  authenticate, 
  isAdmin 
} from '../middleware/auth.middleware';
import { 
  validateIdParam 
} from '../middleware/validate.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * GET /api/ubicaciones/jerarquia
 * Obtener jerarquía completa (departamentos > provincias > distritos)
 * Útil para selectores en cascada
 */
router.get(
  '/jerarquia',
  UbicacionController.getJerarquiaCompleta
);

// ============================================
// DEPARTAMENTOS
// ============================================

/**
 * GET /api/ubicaciones/departamentos
 * Obtener todos los departamentos
 */
router.get(
  '/departamentos',
  UbicacionController.getAllDepartamentos
);

/**
 * GET /api/ubicaciones/departamentos/:id
 * Obtener un departamento por ID
 */
router.get(
  '/departamentos/:id',
  validateIdParam('id'),
  UbicacionController.getDepartamentoById
);

/**
 * GET /api/ubicaciones/departamentos/:departamentoId/provincias
 * Obtener provincias de un departamento
 */
router.get(
  '/departamentos/:departamentoId/provincias',
  validateIdParam('departamentoId'),
  UbicacionController.getProvinciasByDepartamento
);

/**
 * POST /api/ubicaciones/departamentos
 * Crear un departamento (solo admin)
 */
router.post(
  '/departamentos',
  authenticate,
  isAdmin,
  UbicacionController.createDepartamento
);

// ============================================
// PROVINCIAS
// ============================================

/**
 * GET /api/ubicaciones/provincias
 * Obtener todas las provincias
 */
router.get(
  '/provincias',
  UbicacionController.getAllProvincias
);

/**
 * GET /api/ubicaciones/provincias/:id
 * Obtener una provincia por ID
 */
router.get(
  '/provincias/:id',
  validateIdParam('id'),
  UbicacionController.getProvinciaById
);

/**
 * GET /api/ubicaciones/provincias/:provinciaId/distritos
 * Obtener distritos de una provincia
 */
router.get(
  '/provincias/:provinciaId/distritos',
  validateIdParam('provinciaId'),
  UbicacionController.getDistritosByProvincia
);

/**
 * POST /api/ubicaciones/provincias
 * Crear una provincia (solo admin)
 */
router.post(
  '/provincias',
  authenticate,
  isAdmin,
  UbicacionController.createProvincia
);

// ============================================
// DISTRITOS
// ============================================

/**
 * GET /api/ubicaciones/distritos
 * Obtener todos los distritos
 */
router.get(
  '/distritos',
  UbicacionController.getAllDistritos
);

/**
 * GET /api/ubicaciones/distritos/search
 * Buscar distritos
 * Query params: q (término de búsqueda)
 * IMPORTANTE: Esta ruta debe ir ANTES de /distritos/:id
 */
router.get(
  '/distritos/search',
  UbicacionController.searchDistritos
);

/**
 * GET /api/ubicaciones/distritos/:id
 * Obtener un distrito por ID
 */
router.get(
  '/distritos/:id',
  validateIdParam('id'),
  UbicacionController.getDistritoById
);

/**
 * GET /api/ubicaciones/distritos/:id/completa
 * Obtener ubicación completa de un distrito
 * (departamento > provincia > distrito)
 */
router.get(
  '/distritos/:id/completa',
  validateIdParam('id'),
  UbicacionController.getUbicacionCompleta
);

/**
 * POST /api/ubicaciones/distritos
 * Crear un distrito (solo admin)
 */
router.post(
  '/distritos',
  authenticate,
  isAdmin,
  UbicacionController.createDistrito
);

export default router;