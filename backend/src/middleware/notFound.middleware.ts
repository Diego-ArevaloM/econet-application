/**
 * ============================================
 * NOT FOUND MIDDLEWARE
 * ============================================
 * Middleware para manejar rutas no encontradas (404)
 */

import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/apiError';

/**
 * Middleware para manejar rutas no encontradas
 * Debe colocarse después de todas las rutas pero antes del error handler
 * 
 * @example
 * ```typescript
 * // En app.ts
 * app.use('/api', routes);
 * app.use(notFound);
 * app.use(errorHandler);
 * ```
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`Ruta no encontrada: ${req.method} ${req.path}`);
  next(error);
};

/**
 * Versión alternativa que envía respuesta directa (sin pasar por error handler)
 */
export const notFoundDirect = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.path} no existe`,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      resenas: '/api/resenas',
      laboratorios: '/api/laboratorios',
    },
  });
};