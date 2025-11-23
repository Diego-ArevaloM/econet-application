/**
 * ============================================
 * AUTH SERVICE
 * ============================================
 * Lógica de negocio para autenticación y usuarios
 */

import { UserModel } from '../models/user.model';
import { CreateUsuarioDto, LoginDto, Usuario } from '../types';
import { generateToken } from '../utils/jwt.utils';
import { 
  BadRequestError, 
  UnauthorizedError, 
  ConflictError,
  NotFoundError 
} from '../utils/apiError';
import { 
  isValidEmail, 
  isValidPassword,
  getPasswordRequirements 
} from '../utils/validators';

export class AuthService {
  /**
   * Registrar un nuevo usuario
   * Valida datos y crea usuario con cuenta
   */
  static async register(userData: CreateUsuarioDto): Promise<{
    userId: number;
    message: string;
  }> {
    // Validar email
    if (!isValidEmail(userData.correo_electronico)) {
      throw new BadRequestError('El formato del email es inválido');
    }

    // Validar contraseña
    if (!isValidPassword(userData.contrasenia)) {
      const requirements = getPasswordRequirements(userData.contrasenia);
      throw new BadRequestError(
        `La contraseña no cumple con los requisitos: ${requirements.join(', ')}`
      );
    }

    // Verificar si el email ya existe
    const emailExists = await UserModel.emailExists(userData.correo_electronico);
    if (emailExists) {
      throw new ConflictError('El correo electrónico ya está registrado');
    }

    // Validar nombres y apellidos
    if (userData.nombres.trim().length < 2) {
      throw new BadRequestError('El nombre debe tener al menos 2 caracteres');
    }

    if (userData.apellidos.trim().length < 2) {
      throw new BadRequestError('El apellido debe tener al menos 2 caracteres');
    }

    // Crear usuario
    const userId = await UserModel.create({
      ...userData,
      tipo_usuario: userData.tipo_usuario || 'cliente',
    });

    return {
      userId,
      message: 'Usuario registrado exitosamente',
    };
  }

  /**
   * Iniciar sesión
   * Valida credenciales y genera token JWT
   */
  static async login(credentials: LoginDto): Promise<{
    token: string;
    user: {
      id: number;
      nombres: string;
      apellidos: string;
      correo_electronico: string;
      tipo_usuario: string;
    };
  }> {
    // Validar email
    if (!isValidEmail(credentials.correo_electronico)) {
      throw new BadRequestError('El formato del email es inválido');
    }

    // Buscar usuario
    const user = await UserModel.findByEmail(credentials.correo_electronico);

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await UserModel.verifyPassword(
      credentials.contrasenia,
      user.contrasenia
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id_usuario,
      email: user.correo_electronico,
      tipo: user.tipo_usuario,
    });

    return {
      token,
      user: {
        id: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo_electronico: user.correo_electronico,
        tipo_usuario: user.tipo_usuario,
      },
    };
  }

  /**
   * Obtener perfil de usuario
   */
  static async getProfile(userId: number): Promise<Usuario> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateProfile(
    userId: number,
    data: { nombres?: string; apellidos?: string }
  ): Promise<Usuario> {
    // Validar datos si están presentes
    if (data.nombres && data.nombres.trim().length < 2) {
      throw new BadRequestError('El nombre debe tener al menos 2 caracteres');
    }

    if (data.apellidos && data.apellidos.trim().length < 2) {
      throw new BadRequestError('El apellido debe tener al menos 2 caracteres');
    }

    // Actualizar usuario
    const updated = await UserModel.update(userId, data);

    if (!updated) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Obtener usuario actualizado
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Validar nueva contraseña
    if (!isValidPassword(newPassword)) {
      const requirements = getPasswordRequirements(newPassword);
      throw new BadRequestError(
        `La nueva contraseña no cumple con los requisitos: ${requirements.join(', ')}`
      );
    }

    // Verificar que la nueva contraseña sea diferente
    if (currentPassword === newPassword) {
      throw new BadRequestError('La nueva contraseña debe ser diferente a la actual');
    }

    // Obtener usuario con contraseña
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Buscar con contraseña
    const userWithPassword = await UserModel.findByEmail(user.correo_electronico);
    if (!userWithPassword) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await UserModel.verifyPassword(
      currentPassword,
      userWithPassword.contrasenia
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('La contraseña actual es incorrecta');
    }

    // Actualizar contraseña
    await UserModel.updatePassword(userId, newPassword);

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  /**
   * Obtener estadísticas del usuario
   */
  static async getUserStats(userId: number): Promise<{
    usuario: Usuario;
    estadisticas: {
      total_resenas: number;
      promedio_calificaciones: number;
    };
  }> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const stats = await UserModel.getStats(userId);

    return {
      usuario: user,
      estadisticas: stats,
    };
  }

  /**
   * Verificar si un usuario puede realizar una acción de admin
   */
  static async verifyAdminAccess(userId: number): Promise<void> {
    const isAdmin = await UserModel.isAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError('Se requieren permisos de administrador');
    }
  }

  /**
   * Listar todos los usuarios (solo admin)
   */
  static async getAllUsers(): Promise<Usuario[]> {
    return await UserModel.getAll();
  }

  /**
   * Eliminar usuario (solo admin o el mismo usuario)
   */
  static async deleteUser(userId: number, requestingUserId: number): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Verificar permisos: solo el mismo usuario o un admin puede eliminar
    const isAdmin = await UserModel.isAdmin(requestingUserId);
    const isSameUser = userId === requestingUserId;

    if (!isAdmin && !isSameUser) {
      throw new UnauthorizedError('No tienes permisos para eliminar este usuario');
    }

    // No permitir que un admin se elimine a sí mismo
    if (isAdmin && isSameUser) {
      throw new BadRequestError('Un administrador no puede eliminarse a sí mismo');
    }

    await UserModel.delete(userId);

    return {
      message: 'Usuario eliminado exitosamente',
    };
  }
}
