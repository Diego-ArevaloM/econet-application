/**
 * ============================================
 * LABORATORIO ROUTES
 * ============================================
 * Rutas para gestión de laboratorios
 */

import { Router } from 'express';
import { LaboratorioController } from '../controllers/laboratorio.controller';
import { 
  authenticate, 
  isAdmin 
} from '../middleware/auth.middleware';
import { 
  validateLaboratorio,
  validateIdParam 
} from '../middleware/validate.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * GET /api/laboratorios
 * Obtener todos los laboratorios
 */
router.get(
  '/',
  LaboratorioController.getAll
);

/**
 * GET /api/laboratorios/search
 * Buscar laboratorios por nombre
 * Query params: q (nombre del laboratorio)
 * IMPORTANTE: Esta ruta debe ir ANTES de /:id
 */
router.get(
  '/search',
  LaboratorioController.searchByName
);

/**
 * GET /api/laboratorios/top
 * Obtener laboratorios con más productos
 * Query params: limit
 */
router.get(
  '/top',
  LaboratorioController.getTopLaboratorios
);

/**
 * GET /api/laboratorios/:id
 * Obtener un laboratorio por ID con estadísticas
 */
router.get(
  '/:id',
  validateIdParam('id'),
  LaboratorioController.getById
);

/**
 * GET /api/laboratorios/:id/stats
 * Obtener estadísticas de un laboratorio
 */
router.get(
  '/:id/stats',
  validateIdParam('id'),
  LaboratorioController.getStats
);

// ============================================
// RUTAS PROTEGIDAS (SOLO ADMINISTRADORES)
// ============================================

/**
 * POST /api/laboratorios
 * Crear un nuevo laboratorio (solo admin)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  validateLaboratorio,
  LaboratorioController.create
);

/**
 * PUT /api/laboratorios/:id
 * Actualizar un laboratorio (solo admin)
 */
router.put(
  '/:id',
  authenticate,
  isAdmin,
  validateIdParam('id'),
  LaboratorioController.update
);

/**
 * DELETE /api/laboratorios/:id
 * Eliminar un laboratorio (solo admin)
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  validateIdParam('id'),
  LaboratorioController.delete
);

export default router;