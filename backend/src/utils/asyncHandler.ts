/**
 * ============================================
 * ASYNC HANDLER
 * ============================================
 * Wrapper para funciones asíncronas en Express
 * Elimina la necesidad de try-catch en cada controlador
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Tipo para funciones async de Express
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wrapper para funciones asíncronas
 * Captura automáticamente los errores y los pasa al middleware de error
 * 
 * @param fn Función asíncrona a envolver
 * @returns Función envuelta que maneja errores automáticamente
 * 
 * @example
 * ```typescript
 * export const getUsers = asyncHandler(async (req, res) => {
 *   const users = await UserModel.getAll();
 *   res.json({ success: true, data: users });
 * });
 * ```
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Versión alternativa con soporte para múltiples handlers
 * Útil para cadenas de middlewares
 * 
 * @example
 * ```typescript
 * router.post('/users', 
 *   asyncHandlerChain(validateUser, checkPermissions, createUser)
 * );
 * ```
 */
export const asyncHandlerChain = (...handlers: AsyncFunction[]) => {
  return handlers.map((handler) => asyncHandler(handler));
};

/**
 * Handler específico para operaciones de transacción
 * Incluye logging adicional y manejo específico de errores de DB
 */
export const transactionHandler = (fn: AsyncFunction) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    try {
      await fn(req, res, next);
      
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        console.warn(`⚠️  Transacción lenta detectada: ${duration}ms en ${req.path}`);
      }
    } catch (error) {
      console.error('❌ Error en transacción:', {
        path: req.path,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      });
      throw error;
    }
  });
};

export default asyncHandler;