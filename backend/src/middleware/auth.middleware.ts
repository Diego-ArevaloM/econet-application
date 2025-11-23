/**
 * ============================================
 * AUTH MIDDLEWARE
 * ============================================
 * Middleware para autenticación y autorización
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.utils';
import { UnauthorizedError, ForbiddenError } from '../utils/apiError';
import { JwtPayload } from '../types';

/**
 * Middleware de autenticación
 * Verifica que el usuario tenga un token JWT válido
 * Agrega el payload del token a req.user
 * 
 * @example
 * ```typescript
 * router.get('/profile', authenticate, getProfile);
 * ```
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extraer token del header Authorization
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('Token no proporcionado. Por favor inicia sesión');
    }

    // Verificar y decodificar token
    const payload = verifyToken(token);

    // Agregar usuario al request
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 * Debe usarse después del middleware authenticate
 * 
 * @example
 * ```typescript
 * router.post('/products', authenticate, isAdmin, createProduct);
 * ```
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (user.tipo !== 'administrador') {
      throw new ForbiddenError('Se requieren permisos de administrador');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar si el usuario es cliente
 * Debe usarse después del middleware authenticate
 * 
 * @example
 * ```typescript
 * router.post('/reviews', authenticate, isClient, createReview);
 * ```
 */
export const isClient = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (user.tipo !== 'cliente') {
      throw new ForbiddenError('Esta acción solo está disponible para clientes');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar si el usuario es el propietario del recurso
 * Compara el ID del usuario con un parámetro de la ruta
 * 
 * @param paramName Nombre del parámetro que contiene el ID del usuario
 * 
 * @example
 * ```typescript
 * router.put('/users/:userId', authenticate, isOwner('userId'), updateUser);
 * ```
 */
export const isOwner = (paramName: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const resourceUserId = parseInt(req.params[paramName]);

      if (user.id !== resourceUserId) {
        throw new ForbiddenError('No tienes permisos para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware para verificar si el usuario es administrador O propietario
 * Útil para endpoints donde tanto admin como el dueño pueden modificar
 * 
 * @param paramName Nombre del parámetro que contiene el ID del usuario
 * 
 * @example
 * ```typescript
 * router.delete('/reviews/:userId/:reviewId', authenticate, isAdminOrOwner('userId'), deleteReview);
 * ```
 */
export const isAdminOrOwner = (paramName: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      // Si es admin, permitir
      if (user.tipo === 'administrador') {
        return next();
      }

      // Si no es admin, verificar si es el propietario
      const resourceUserId = parseInt(req.params[paramName]);

      if (user.id !== resourceUserId) {
        throw new ForbiddenError('No tienes permisos para realizar esta acción');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware de autenticación opcional
 * Si hay token lo verifica, si no hay token continúa sin error
 * Útil para endpoints públicos que pueden tener funcionalidad adicional para usuarios autenticados
 * 
 * @example
 * ```typescript
 * router.get('/products', optionalAuthenticate, getProducts);
 * // Los productos se muestran a todos, pero usuarios autenticados ven info adicional
 * ```
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Si hay error en el token opcional, continuar sin autenticar
    next();
  }
};