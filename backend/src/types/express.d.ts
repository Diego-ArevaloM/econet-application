/**
 * ============================================
 * EXTENSIÓN DE TIPOS DE EXPRESS
 * ============================================
 * Agrega propiedades personalizadas a los objetos Request de Express
 */

import { JwtPayload } from './index';

/**
 * Extender la interfaz Request de Express
 * para incluir información del usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Usuario autenticado (agregado por el middleware de autenticación)
       */
      user?: JwtPayload;

      /**
       * ID de la solicitud (para tracking/logging)
       */
      requestId?: string;

      /**
       * Timestamp del inicio de la request
       */
      startTime?: number;
    }
  }
}

/**
 * Exportar vacío para que TypeScript trate este archivo como un módulo
 */
export {};