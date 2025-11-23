/**
 * ============================================
 * API RESPONSE HELPERS
 * ============================================
 * Funciones para crear respuestas estandarizadas
 */

import { Response } from 'express';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../types/api.types';

/**
 * Envía una respuesta exitosa estándar
 * 
 * @param res Response de Express
 * @param data Datos a enviar
 * @param message Mensaje opcional
 * @param statusCode Código HTTP (default: 200)
 * 
 * @example
 * ```typescript
 * sendSuccess(res, users, 'Usuarios obtenidos exitosamente');
 * ```
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Envía una respuesta de creación exitosa (201)
 * 
 * @example
 * ```typescript
 * sendCreated(res, newUser, 'Usuario creado exitosamente');
 * ```
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Recurso creado exitosamente'
): Response => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Envía una respuesta sin contenido (204)
 * Útil para DELETE exitoso
 * 
 * @example
 * ```typescript
 * sendNoContent(res);
 * ```
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Envía una respuesta paginada
 * 
 * @param res Response de Express
 * @param data Array de datos
 * @param meta Metadata de paginación
 * @param message Mensaje opcional
 * 
 * @example
 * ```typescript
 * sendPaginated(res, productos, {
 *   currentPage: 1,
 *   totalPages: 5,
 *   totalItems: 100,
 *   itemsPerPage: 20,
 *   hasNextPage: true,
 *   hasPrevPage: false
 * });
 * ```
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message?: string
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    meta,
  };

  return res.status(200).json(response);
};

/**
 * Calcula metadata de paginación
 * 
 * @param totalItems Total de registros
 * @param currentPage Página actual
 * @param itemsPerPage Items por página
 * @returns Metadata de paginación
 * 
 * @example
 * ```typescript
 * const meta = calculatePaginationMeta(100, 1, 20);
 * // { currentPage: 1, totalPages: 5, totalItems: 100, ... }
 * ```
 */
export const calculatePaginationMeta = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Envía respuesta con datos y metadata de paginación calculada automáticamente
 * 
 * @example
 * ```typescript
 * sendPaginatedWithTotal(res, productos, 100, 1, 20);
 * ```
 */
export const sendPaginatedWithTotal = <T>(
  res: Response,
  data: T[],
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  message?: string
): Response => {
  const meta = calculatePaginationMeta(totalItems, currentPage, itemsPerPage);
  return sendPaginated(res, data, meta, message);
};

/**
 * Envía respuesta de error (no usar directamente, usar el middleware de errores)
 * Esta función es principalmente para casos especiales
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Helper para extraer parámetros de paginación de la query string
 * 
 * @param query Query params de Express
 * @returns Objeto con page y limit validados
 * 
 * @example
 * ```typescript
 * const { page, limit } = getPaginationParams(req.query);
 * ```
 */
export const getPaginationParams = (query: any): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));

  return { page, limit };
};

/**
 * Calcula el offset para la query SQL
 * 
 * @param page Número de página
 * @param limit Items por página
 * @returns Offset para la query
 * 
 * @example
 * ```typescript
 * const offset = calculateOffset(2, 10); // 10
 * ```
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Formatea datos antes de enviarlos en la respuesta
 * Elimina campos sensibles como contraseñas
 * 
 * @param data Datos a formatear
 * @param fieldsToRemove Campos a eliminar
 * @returns Datos formateados
 */
export const sanitizeResponse = <T extends Record<string, any>>(
  data: T | T[],
  fieldsToRemove: string[] = ['contrasenia', 'password', 'hash']
): T | T[] => {
  const removeFields = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(removeFields);
    }

    const sanitized = { ...obj };
    fieldsToRemove.forEach((field) => {
      delete sanitized[field];
    });

    return sanitized;
  };

  return removeFields(data);
};

/**
 * Envía respuesta con datos sanitizados
 */
export const sendSanitized = <T extends Record<string, any>>(
  res: Response,
  data: T | T[],
  message?: string,
  statusCode: number = 200
): Response => {
  const sanitized = sanitizeResponse(data);
  return sendSuccess(res, sanitized, message, statusCode);
};