/**
 * ============================================
 * ERROR HANDLER MIDDLEWARE
 * ============================================
 * Middleware para manejo global de errores
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError, handleDatabaseError, isOperationalError } from '../utils/apiError';
import { config, isDevelopment } from '../config/env';

/**
 * Middleware para manejo de errores global
 * Debe ser el último middleware en la cadena
 * 
 * @example
 * ```typescript
 * // En app.ts
 * app.use(errorHandler);
 * ```
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error
  console.error('❌ Error capturado:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err);

  // Si es un error de API conocido
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
      ...(isDevelopment() && { stack: err.stack }),
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Errores específicos de PostgreSQL
  const pgError = err as any;
  if (pgError.code && pgError.code.startsWith('23')) {
    const apiError = handleDatabaseError(pgError);
    res.status(apiError.statusCode).json({
      success: false,
      error: apiError.message,
      details: apiError.details,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expirado',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'JSON inválido en el cuerpo de la solicitud',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Error genérico
  const statusCode = 500;
  const message = isDevelopment() 
    ? err.message 
    : 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDevelopment() && {
      stack: err.stack,
      details: err,
    }),
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

/**
 * Middleware para capturar errores asíncronos no manejados
 * Alternativa al asyncHandler utility
 */
export const asyncErrorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Logger de errores no operacionales
 * Errores que no deberían ocurrir en producción
 */
export const logNonOperationalError = (err: Error): void => {
  if (!isOperationalError(err)) {
    console.error('🚨 ERROR NO OPERACIONAL DETECTADO:');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    
    // Aquí podrías enviar a un servicio de logging externo
    // como Sentry, LogRocket, etc.
    // Ejemplo: Sentry.captureException(err);
  }
};

/**
 * Manejo de rechazos de promesas no capturados
 * Se debe registrar en el index/server principal
 */
export const handleUnhandledRejection = (reason: any, promise: Promise<any>): void => {
  console.error('🚨 UNHANDLED PROMISE REJECTION:');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  
  // En producción, podrías querer cerrar el servidor
  if (config.NODE_ENV === 'production') {
    console.error('🔴 Cerrando servidor debido a unhandled rejection...');
    process.exit(1);
  }
};

/**
 * Manejo de excepciones no capturadas
 * Se debe registrar en el index/server principal
 */
export const handleUncaughtException = (err: Error): void => {
  console.error('🚨 UNCAUGHT EXCEPTION:');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Cerrar el servidor de forma limpia
  console.error('🔴 Cerrando servidor debido a uncaught exception...');
  process.exit(1);
};