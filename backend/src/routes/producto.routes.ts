/**
 * ============================================
 * PRODUCTO ROUTES
 * ============================================
 * Rutas para gestión de productos
 */

import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { 
  authenticate, 
  isAdmin,
  optionalAuthenticate 
} from '../middleware/auth.middleware';
import { 
  validateProducto,
  validateIdParam 
} from '../middleware/validate.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * GET /api/productos
 * Obtener todos los productos con filtros y paginación
 * Query params: page, limit, tipo, forma, objetivo_salud, laboratorio, busqueda
 */
router.get(
  '/',
  ProductoController.getAll
);

/**
 * GET /api/productos/search
 * Buscar productos
 * Query params: q (término de búsqueda), limit
 * IMPORTANTE: Esta ruta debe ir ANTES de /:id para evitar conflictos
 */
router.get(
  '/search',
  ProductoController.search
);

/**
 * GET /api/productos/top-rated
 * Obtener productos mejor calificados
 * Query params: limit
 */
router.get(
  '/top-rated',
  ProductoController.getTopRated
);

/**
 * GET /api/productos/stats/general
 * Obtener estadísticas generales de productos
 */
router.get(
  '/stats/general',
  ProductoController.getGeneralStats
);

/**
 * GET /api/productos/laboratorio/:laboratorioId
 * Obtener productos de un laboratorio específico
 */
router.get(
  '/laboratorio/:laboratorioId',
  validateIdParam('laboratorioId'),
  ProductoController.getByLaboratorio
);

/**
 * GET /api/productos/:id
 * Obtener un producto por ID
 */
router.get(
  '/:id',
  validateIdParam('id'),
  ProductoController.getById
);

/**
 * GET /api/productos/:id/images
 * Obtener imágenes de un producto
 */
router.get(
  '/:id/images',
  validateIdParam('id'),
  ProductoController.getImages
);

// ============================================
// RUTAS PROTEGIDAS (SOLO ADMINISTRADORES)
// ============================================

/**
 * POST /api/productos
 * Crear un nuevo producto (solo admin)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  validateProducto,
  ProductoController.create
);

/**
 * PUT /api/productos/:id
 * Actualizar un producto (solo admin)
 */
router.put(
  '/:id',
  authenticate,
  isAdmin,
  validateIdParam('id'),
  ProductoController.update
);

/**
 * DELETE /api/productos/:id
 * Eliminar un producto (solo admin)
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  validateIdParam('id'),
  ProductoController.delete
);

/**
 * POST /api/productos/:id/images
 * Agregar imagen a un producto (solo admin)
 */
router.post(
  '/:id/images',
  authenticate,
  isAdmin,
  validateIdParam('id'),
  ProductoController.addImage
);

export default router;