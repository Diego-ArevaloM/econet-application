/**
 * ============================================
 * AUTH ROUTES
 * ============================================
 * Rutas para autenticación y gestión de usuarios
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { 
  authenticate, 
  isAdmin, 
  isAdminOrOwner 
} from '../middleware/auth.middleware';
import { 
  validateRegister, 
  validateLogin,
  validateIdParam 
} from '../middleware/validate.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post(
  '/register',
  validateRegister,
  AuthController.register
);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post(
  '/login',
  validateLogin,
  AuthController.login
);

// ============================================
// RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN)
// ============================================

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
router.get(
  '/profile',
  authenticate,
  AuthController.getProfile
);

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario autenticado
 */
router.put(
  '/profile',
  authenticate,
  AuthController.updateProfile
);

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña
 */
router.put(
  '/change-password',
  authenticate,
  AuthController.changePassword
);

/**
 * GET /api/auth/me/stats
 * Obtener estadísticas del usuario autenticado
 */
router.get(
  '/me/stats',
  authenticate,
  AuthController.getUserStats
);

// ============================================
// RUTAS DE ADMINISTRADOR
// ============================================

/**
 * GET /api/auth/users
 * Listar todos los usuarios (solo admin)
 */
router.get(
  '/users',
  authenticate,
  isAdmin,
  AuthController.getAllUsers
);

/**
 * DELETE /api/auth/users/:id
 * Eliminar un usuario (admin o el mismo usuario)
 */
router.delete(
  '/users/:id',
  authenticate,
  validateIdParam('id'),
  isAdminOrOwner('id'),
  AuthController.deleteUser
);

export default router;