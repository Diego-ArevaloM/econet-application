/**
 * ============================================
 * ROUTES INDEX
 * ============================================
 * Centralizador de todas las rutas de la API
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import productoRoutes from './producto.routes';
import resenaRoutes from './resena.routes';
import laboratorioRoutes from './laboratorio.routes';
import ubicacionRoutes from './ubicacion.routes';

const router = Router();

// ============================================
// MONTAR RUTAS
// ============================================

/**
 * Rutas de autenticación y usuarios
 * Base: /api/auth
 */
router.use('/auth', authRoutes);

/**
 * Rutas de productos
 * Base: /api/productos
 */
router.use('/productos', productoRoutes);

/**
 * Rutas de reseñas
 * Base: /api/resenas
 */
router.use('/resenas', resenaRoutes);

/**
 * Rutas de laboratorios
 * Base: /api/laboratorios
 */
router.use('/laboratorios', laboratorioRoutes);

/**
 * Rutas de ubicaciones
 * Base: /api/ubicaciones
 */
router.use('/ubicaciones', ubicacionRoutes);

export default router;