/**
 * ============================================
 * API ERRORS
 * ============================================
 * Clases de error personalizadas para diferentes escenarios
 */

/**
 * Clase base para errores de API
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    
    // Mantener el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly (necesario para extender Error en TypeScript)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * 400 - Bad Request
 * Solicitud mal formada o datos inválidos
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Solicitud inválida', details?: any) {
    super(400, message, true, details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 401 - Unauthorized
 * No autenticado o token inválido/expirado
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'No autorizado. Inicia sesión primero') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 - Forbidden
 * Autenticado pero sin permisos suficientes
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'No tienes permisos para realizar esta acción') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 404 - Not Found
 * Recurso no encontrado
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso no encontrado', resource?: string) {
    const fullMessage = resource ? `${resource} no encontrado` : message;
    super(404, fullMessage);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 409 - Conflict
 * Conflicto con el estado actual (ej: email ya existe)
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'El recurso ya existe', details?: any) {
    super(409, message, true, details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 - Unprocessable Entity
 * Error de validación de datos
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Error de validación', errors?: any[]) {
    super(422, message, true, { errors });
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 429 - Too Many Requests
 * Rate limit excedido
 */
export class TooManyRequestsError extends ApiError {
  constructor(message: string = 'Demasiadas solicitudes. Intenta más tarde') {
    super(429, message);
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

/**
 * 500 - Internal Server Error
 * Error del servidor (no operacional)
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Error interno del servidor', isOperational: boolean = false) {
    super(500, message, isOperational);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * 503 - Service Unavailable
 * Servicio temporalmente no disponible
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Servicio temporalmente no disponible') {
    super(503, message);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Error específico de base de datos
 */
export class DatabaseError extends ApiError {
  constructor(message: string = 'Error en la base de datos', details?: any) {
    super(500, message, false, details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Error de JWT
 */
export class JWTError extends ApiError {
  constructor(message: string = 'Error de autenticación') {
    super(401, message);
    Object.setPrototypeOf(this, JWTError.prototype);
  }
}

/**
 * Helper para verificar si un error es operacional
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof ApiError) {
    return error.isOperational;
  }
  return false;
};

/**
 * Helper para convertir errores de PostgreSQL a ApiError
 */
export const handleDatabaseError = (error: any): ApiError => {
  // Error de clave única violada (duplicate)
  if (error.code === '23505') {
    const field = error.detail?.match(/\(([^)]+)\)/)?.[1] || 'campo';
    return new ConflictError(`El ${field} ya está en uso`);
  }

  // Error de clave foránea violada
  if (error.code === '23503') {
    return new BadRequestError('Referencia a registro inexistente');
  }

  // Error de restricción NOT NULL
  if (error.code === '23502') {
    const column = error.column || 'campo requerido';
    return new BadRequestError(`El campo ${column} es obligatorio`);
  }

  // Error de restricción CHECK
  if (error.code === '23514') {
    return new BadRequestError('Los datos no cumplen con las restricciones');
  }

  // Error genérico de base de datos
  return new DatabaseError('Error al procesar la operación', {
    code: error.code,
    detail: error.detail,
  });
};

/**
 * Helper para crear error de validación con múltiples campos
 */
export const createValidationError = (errors: Array<{ field: string; message: string }>) => {
  return new ValidationError('Error de validación', errors);
};