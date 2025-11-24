/**
 * ============================================
 * AUTH CONTROLLER
 * ============================================
 * Controlador para endpoints de autenticación y usuarios
 */

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendSanitized } from '../utils/apiResponse';
import { CreateUsuarioDto, LoginDto } from '../types';

export class AuthController {
  /**
   * POST /api/auth/register
   * Registrar un nuevo usuario
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const userData: CreateUsuarioDto = req.body;

    const result = await AuthService.register(userData);

    sendCreated(res, { userId: result.userId }, result.message);
  });

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const credentials: LoginDto = req.body;

    const result = await AuthService.login(credentials);

    sendSuccess(
      res,
      {
        token: result.token,
        user: result.user,
      },
      'Inicio de sesión exitoso'
    );
  });

  /**
   * GET /api/auth/profile
   * Obtener perfil del usuario autenticado
   * Requiere autenticación
   */
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await AuthService.getProfile(userId);

    sendSanitized(res, user, 'Perfil obtenido exitosamente');
  });

  /**
   * PUT /api/auth/profile
   * Actualizar perfil del usuario autenticado
   * Requiere autenticación
   */
  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { nombres, apellidos } = req.body;

    const user = await AuthService.updateProfile(userId, {
      nombres,
      apellidos,
    });

    sendSanitized(res, user, 'Perfil actualizado exitosamente');
  });

  /**
   * PUT /api/auth/change-password
   * Cambiar contraseña del usuario autenticado
   * Requiere autenticación
   */
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const result = await AuthService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    sendSuccess(res, null, result.message);
  });

  /**
   * GET /api/auth/me/stats
   * Obtener estadísticas del usuario autenticado
   * Requiere autenticación
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const stats = await AuthService.getUserStats(userId);

    sendSuccess(res, stats, 'Estadísticas obtenidas exitosamente');
  });

  /**
   * GET /api/auth/users
   * Listar todos los usuarios
   * Requiere autenticación de administrador
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await AuthService.getAllUsers();

    sendSanitized(res, users, 'Usuarios obtenidos exitosamente');
  });

  /**
   * DELETE /api/auth/users/:id
   * Eliminar un usuario
   * Requiere autenticación (admin o mismo usuario)
   */
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const requestingUserId = req.user!.id;

    const result = await AuthService.deleteUser(userId, requestingUserId);

    sendSuccess(res, null, result.message);
  });
}