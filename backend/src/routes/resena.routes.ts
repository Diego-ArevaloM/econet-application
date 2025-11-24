/**
 * ============================================
 * RESEÑA ROUTES
 * ============================================
 * Rutas para gestión de reseñas
 */

import { Router } from 'express';
import { ResenaController } from '../controllers/resena.controller';
import { 
  authenticate,
  isAdminOrOwner 
} from '../middleware/auth.middleware';
import { 
  validateResena,
  validateIdParam 
} from '../middleware/validate.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * GET /api/resenas/producto/:productoId
 * Obtener reseñas de un producto
 */
router.get(
  '/producto/:productoId',
  validateIdParam('productoId'),
  ResenaController.getByProducto
);

/**
 * GET /api/resenas/producto/:productoId/promedio
 * Obtener calificación promedio de un producto
 */
router.get(
  '/producto/:productoId/promedio',
  validateIdParam('productoId'),
  ResenaController.getCalificacionPromedio
);

/**
 * GET /api/resenas/usuario/:usuarioId
 * Obtener reseñas de un usuario
 */
router.get(
  '/usuario/:usuarioId',
  validateIdParam('usuarioId'),
  ResenaController.getByUsuario
);

/**
 * GET /api/resenas/stats
 * Obtener estadísticas de reseñas
 */
router.get(
  '/stats',
  ResenaController.getStats
);

/**
 * GET /api/resenas/:id
 * Obtener una reseña específica
 */
router.get(
  '/:id',
  validateIdParam('id'),
  ResenaController.getById
);

// ============================================
// RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN)
// ============================================

/**
 * POST /api/resenas
 * Crear una nueva reseña
 */
router.post(
  '/',
  authenticate,
  validateResena,
  ResenaController.create
);

/**
 * GET /api/resenas/me
 * Obtener reseñas del usuario autenticado
 * NOTA: Esta ruta debe ir ANTES de /:id
 */
router.get(
  '/me',
  authenticate,
  ResenaController.getMyResenas
);

/**
 * GET /api/resenas/can-review/:productoId
 * Verificar si el usuario puede dejar una reseña
 */
router.get(
  '/can-review/:productoId',
  authenticate,
  validateIdParam('productoId'),
  ResenaController.canUserReview
);

/**
 * PUT /api/resenas/:id
 * Actualizar una reseña (solo el propietario)
 */
router.put(
  '/:id',
  authenticate,
  validateIdParam('id'),
  ResenaController.update
);

/**
 * DELETE /api/resenas/:id
 * Eliminar una reseña (propietario o admin)
 */
router.delete(
  '/:id',
  authenticate,
  validateIdParam('id'),
  ResenaController.delete
);

export default router;