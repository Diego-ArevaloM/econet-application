/**
 * ============================================
 * REQUEST LOGGER MIDDLEWARE
 * ============================================
 * Middleware para logging detallado de requests
 */

import { Request, Response, NextFunction } from 'express';
import { generateUUID } from '../utils/helpers';
import { isDevelopment } from '../config/env';

/**
 * Middleware para logging de requests
 * Registra información detallada de cada request
 * 
 * @example
 * ```typescript
 * // En app.ts
 * app.use(requestLogger);
 * ```
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Generar ID único para la request
  const requestId = generateUUID();
  req.requestId = requestId;

  // Timestamp de inicio
  const startTime = Date.now();
  req.startTime = startTime;

  // Log de request entrante
  if (isDevelopment()) {
    console.log('\n📥 INCOMING REQUEST:');
    console.log(`ID: ${requestId}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`IP: ${req.ip}`);
    
    if (Object.keys(req.query).length > 0) {
      console.log(`Query:`, req.query);
    }
    
    if (Object.keys(req.params).length > 0) {
      console.log(`Params:`, req.params);
    }

    // No loggear el body en producción por seguridad
    if (req.body && Object.keys(req.body).length > 0) {
      // Ocultar campos sensibles
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.contrasenia) sanitizedBody.contrasenia = '***';
      if (sanitizedBody.password) sanitizedBody.password = '***';
      console.log(`Body:`, sanitizedBody);
    }
  }

  // Interceptar el método res.json para loggear la respuesta
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    
    if (isDevelopment()) {
      console.log('\n📤 OUTGOING RESPONSE:');
      console.log(`ID: ${requestId}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Duration: ${duration}ms`);
      
      // Log del tamaño de la respuesta
      const bodySize = JSON.stringify(body).length;
      console.log(`Size: ${bodySize} bytes`);

      // Advertencia si la respuesta es muy lenta
      if (duration > 1000) {
        console.warn(`⚠️  Respuesta lenta detectada: ${duration}ms`);
      }
    }

    // Agregar headers personalizados
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('X-Response-Time', `${duration}ms`);

    return originalJson(body);
  };

  next();
};

/**
 * Middleware para logging simple (solo en consola)
 * Versión ligera del request logger
 */
export const simpleLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    
    console.log(
      `${statusColor} ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

/**
 * Middleware para logging de errores específicos
 * Registra información adicional cuando ocurre un error
 */
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('\n❌ ERROR LOG:');
  console.error(`Request ID: ${req.requestId}`);
  console.error(`Path: ${req.method} ${req.path}`);
  console.error(`User: ${req.user ? req.user.id : 'Not authenticated'}`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack:`, err.stack);

  // Pasar el error al siguiente middleware
  next(err);
};

/**
 * Middleware para tracking de performance
 * Identifica endpoints lentos
 */
export const performanceTracker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Registrar endpoints lentos (más de 1 segundo)
    if (duration > 1000) {
      console.warn('⚠️  SLOW ENDPOINT DETECTED:');
      console.warn(`Path: ${req.method} ${req.path}`);
      console.warn(`Duration: ${duration}ms`);
      console.warn(`Status: ${res.statusCode}`);
      
      // Aquí podrías enviar métricas a un servicio de monitoreo
    }
  });

  next();
};

/**
 * Middleware para contar requests por endpoint
 * Útil para analytics
 */
const requestCounts = new Map<string, number>();

export const requestCounter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const key = `${req.method}:${req.path}`;
  const currentCount = requestCounts.get(key) || 0;
  requestCounts.set(key, currentCount + 1);

  res.on('finish', () => {
    if (isDevelopment()) {
      const count = requestCounts.get(key);
      console.log(`📊 Request count for ${key}: ${count}`);
    }
  });

  next();
};

/**
 * Obtiene las estadísticas de requests
 * Útil para un endpoint de métricas
 */
export const getRequestStats = (): Record<string, number> => {
  return Object.fromEntries(requestCounts);
};

/**
 * Resetea las estadísticas
 */
export const resetRequestStats = (): void => {
  requestCounts.clear();
};