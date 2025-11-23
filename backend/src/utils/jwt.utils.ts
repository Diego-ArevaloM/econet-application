/**
 * ============================================
 * JWT UTILITIES
 * ============================================
 * Funciones para generar y verificar JSON Web Tokens
 */

import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '../types';
import { JWTError } from './apiError';

/**
 * Genera un token JWT
 * 
 * @param payload Datos a incluir en el token
 * @param expiresIn Tiempo de expiración (default: config.JWT_EXPIRES_IN)
 * @returns Token JWT
 * 
 * @example
 * ```typescript
 * const token = generateToken({
 *   id: user.id,
 *   email: user.email,
 *   tipo: user.tipo
 * });
 * ```
 */
export const generateToken = (
  payload: JwtPayload,
  expiresIn?: string | number
): string => {
  try {
    const options: SignOptions = {
      expiresIn: (expiresIn || config.JWT_EXPIRES_IN) as SignOptions['expiresIn'],
      issuer: 'econet-api',
      audience: 'econet-client',
    };

    return jwt.sign(payload, config.JWT_SECRET as string, options);
  } catch (error) {
    console.error('Error al generar token:', error);
    throw new JWTError('Error al generar token de autenticación');
  }
};

/**
 * Verifica y decodifica un token JWT
 * 
 * @param token Token a verificar
 * @returns Payload decodificado
 * @throws JWTError si el token es inválido o expiró
 * 
 * @example
 * ```typescript
 * try {
 *   const payload = verifyToken(token);
 *   console.log(payload.id);
 * } catch (error) {
 *   console.error('Token inválido');
 * }
 * ```
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const options: VerifyOptions = {
      issuer: 'econet-api',
      audience: 'econet-client',
    };

    const decoded = jwt.verify(token, config.JWT_SECRET as string, options) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new JWTError('El token ha expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new JWTError('Token inválido');
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new JWTError('Token aún no es válido');
    }
    
    throw new JWTError('Error al verificar token');
  }
};

/**
 * Decodifica un token sin verificarlo
 * ADVERTENCIA: No usar para autenticación, solo para inspección
 * 
 * @param token Token a decodificar
 * @returns Payload decodificado o null si es inválido
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};

/**
 * Extrae el token del header Authorization
 * Formato esperado: "Bearer <token>"
 * 
 * @param authHeader Header de autorización
 * @returns Token o null si no es válido
 * 
 * @example
 * ```typescript
 * const token = extractTokenFromHeader(req.headers.authorization);
 * ```
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Genera un token de refresh
 * Tiene una duración más larga que el token de acceso
 * 
 * @param payload Datos del usuario
 * @returns Refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return generateToken(payload, '30d'); // 30 días
};

/**
 * Genera ambos tokens (access y refresh)
 * 
 * @param payload Datos del usuario
 * @returns Objeto con accessToken y refreshToken
 * 
 * @example
 * ```typescript
 * const { accessToken, refreshToken } = generateTokenPair({
 *   id: user.id,
 *   email: user.email,
 *   tipo: user.tipo
 * });
 * ```
 */
export const generateTokenPair = (payload: JwtPayload): {
  accessToken: string;
  refreshToken: string;
} => {
  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verifica si un token ha expirado sin lanzar error
 * 
 * @param token Token a verificar
 * @returns true si ha expirado, false si no
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Obtiene el tiempo restante de validez de un token (en segundos)
 * 
 * @param token Token a verificar
 * @returns Segundos restantes o 0 si expiró
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;
    
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Verifica si un token está próximo a expirar
 * 
 * @param token Token a verificar
 * @param thresholdMinutes Minutos de umbral (default: 5)
 * @returns true si está próximo a expirar
 */
export const isTokenExpiringSoon = (
  token: string,
  thresholdMinutes: number = 5
): boolean => {
  const remaining = getTokenTimeRemaining(token);
  const thresholdSeconds = thresholdMinutes * 60;
  
  return remaining > 0 && remaining < thresholdSeconds;
};