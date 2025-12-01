/**
 * ============================================
 * VALIDATION MIDDLEWARE
 * ============================================
 * Middleware para validación de datos de entrada
 */

import { Request, Response, NextFunction } from 'express';
import { 
  ValidationError, 
  BadRequestError, 
  createValidationError 
} from '../utils/apiError';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidRating,
  areValidRatings,
  isNotEmpty,
  isValidLength,
  isValidId,
  validateObject,
  getPasswordRequirements,
} from '../utils/validators';
import { VALIDATION_LIMITS } from '../utils/constants';

/**
 * Interfaz para reglas de validación
 */
interface ValidationRules {
  [field: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'phone' | 'rating';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
    message?: string;
  };
}

/**
 * Middleware genérico de validación
 * Valida los datos del body según las reglas proporcionadas
 * 
 * @param rules Reglas de validación
 * @returns Middleware de Express
 * 
 * @example
 * ```typescript
 * router.post('/users', validate({
 *   nombres: { required: true, type: 'string', minLength: 2 },
 *   email: { required: true, type: 'email' }
 * }), createUser);
 * ```
 */
export const validate = (rules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      // Verificar campo requerido
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: rule.message || `El campo ${field} es requerido`,
        });
        continue;
      }

      // Si el campo no es requerido y está vacío, saltar validaciones
      if (!rule.required && !value) {
        continue;
      }

      // Validación por tipo
      if (rule.type) {
        switch (rule.type) {
          case 'email':
            if (!isValidEmail(value)) {
              errors.push({ field, message: 'Email inválido' });
            }
            break;

          case 'phone':
            if (!isValidPhone(value)) {
              errors.push({ field, message: 'Teléfono inválido' });
            }
            break;

          case 'rating':
            if (!isValidRating(value)) {
              errors.push({ field, message: 'La calificación debe estar entre 0 y 5' });
            }
            break;

          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push({ field, message: 'Debe ser un número' });
            }
            break;

          case 'string':
            if (typeof value !== 'string') {
              errors.push({ field, message: 'Debe ser texto' });
            }
            break;
        }
      }

      // Validación de longitud mínima
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push({
          field,
          message: `Debe tener al menos ${rule.minLength} caracteres`,
        });
      }

      // Validación de longitud máxima
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push({
          field,
          message: `Debe tener máximo ${rule.maxLength} caracteres`,
        });
      }

      // Validación de valor mínimo
      if (rule.min !== undefined && Number(value) < rule.min) {
        errors.push({
          field,
          message: `El valor mínimo es ${rule.min}`,
        });
      }

      // Validación de valor máximo
      if (rule.max !== undefined && Number(value) > rule.max) {
        errors.push({
          field,
          message: `El valor máximo es ${rule.max}`,
        });
      }

      // Validación personalizada
      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field,
          message: rule.message || `Valor inválido para ${field}`,
        });
      }
    }

    if (errors.length > 0) {
      throw createValidationError(errors);
    }

    next();
  };
};

/**
 * Middleware para validar datos de registro
 */
export const validateRegister = validate({
  nombres: {
    required: true,
    type: 'string',
    minLength: VALIDATION_LIMITS.NOMBRE_MIN_LENGTH,
    maxLength: VALIDATION_LIMITS.NOMBRE_MAX_LENGTH,
  },
  apellidos: {
    required: true,
    type: 'string',
    minLength: VALIDATION_LIMITS.NOMBRE_MIN_LENGTH,
    maxLength: VALIDATION_LIMITS.NOMBRE_MAX_LENGTH,
  },
  correo_electronico: {
    required: true,
    type: 'email',
  },
  contrasenia: {
    required: true,
    type: 'string',
    minLength: VALIDATION_LIMITS.PASSWORD_MIN_LENGTH,
    custom: isValidPassword,
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  },
});

/**
 * Middleware para validar datos de login
 */
export const validateLogin = validate({
  correo_electronico: {
    required: true,
    type: 'email',
  },
  contrasenia: {
    required: true,
    type: 'string',
  },
});

/**
 * Middleware para validar creación de producto
 */
export const validateProducto = validate({
  id_laboratorio: {
    required: true,
    type: 'number',
    custom: (value) => isValidId(value),
    message: 'ID de laboratorio inválido',
  },
  descripcion: {
    required: true,
    type: 'string',
    minLength: VALIDATION_LIMITS.DESCRIPCION_MIN_LENGTH,
    maxLength: VALIDATION_LIMITS.DESCRIPCION_MAX_LENGTH,
  },
  tipo: {
    required: true,
    type: 'string',
    maxLength: VALIDATION_LIMITS.TIPO_MAX_LENGTH,
  },
  forma: {
    required: true,
    type: 'string',
    maxLength: VALIDATION_LIMITS.FORMA_MAX_LENGTH,
  },
  objetivo_salud: {
    required: true,
    type: 'string',
    maxLength: VALIDATION_LIMITS.TIPO_MAX_LENGTH,
  },
  solos: {
    required: true,
    type: 'string',
    maxLength: VALIDATION_LIMITS.TIPO_MAX_LENGTH,
  },
});

/**
 * Middleware para validar creación de reseña
 */
export const validateResena = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const {
      id_producto,
      cat_efectividad,
      cat_valor_precio,
      cat_facilidad_uso,
      cat_calidad,
      satisfaccion_general, // ← NUEVO
      descripcion,
    } = req.body;

    const errors: Array<{ field: string; message: string }> = [];

    // Validar ID de producto
    if (!id_producto) {
      errors.push({ field: 'id_producto', message: 'El ID del producto es requerido' });
    } else if (!isValidId(id_producto)) {
      errors.push({ field: 'id_producto', message: 'ID de producto inválido' });
    }

    // Validar calificaciones
    if (cat_efectividad === undefined) {
      errors.push({ field: 'cat_efectividad', message: 'La calificación de efectividad es requerida' });
    } else if (!isValidRating(cat_efectividad)) {
      errors.push({ field: 'cat_efectividad', message: 'La calificación debe estar entre 0 y 5' });
    }

    if (cat_valor_precio === undefined) {
      errors.push({ field: 'cat_valor_precio', message: 'La calificación de precio es requerida' });
    } else if (!isValidRating(cat_valor_precio)) {
      errors.push({ field: 'cat_valor_precio', message: 'La calificación debe estar entre 0 y 5' });
    }

    if (cat_facilidad_uso === undefined) {
      errors.push({ field: 'cat_facilidad_uso', message: 'La calificación de facilidad de uso es requerida' });
    } else if (!isValidRating(cat_facilidad_uso)) {
      errors.push({ field: 'cat_facilidad_uso', message: 'La calificación debe estar entre 0 y 5' });
    }

    if (cat_calidad === undefined) {
      errors.push({ field: 'cat_calidad', message: 'La calificación de calidad es requerida' });
    } else if (!isValidRating(cat_calidad)) {
      errors.push({ field: 'cat_calidad', message: 'La calificación debe estar entre 0 y 5' });
    }

    // ← NUEVO: Validar satisfacción general
    if (satisfaccion_general === undefined) {
      errors.push({ field: 'satisfaccion_general', message: 'La satisfacción general es requerida' });
    } else if (!isValidRating(satisfaccion_general)) {
      errors.push({ field: 'satisfaccion_general', message: 'La satisfacción debe estar entre 0 y 5' });
    }

    // Validar descripción (opcional)
    if (descripcion) {
      if (!isValidLength(descripcion, VALIDATION_LIMITS.RESENA_MIN_LENGTH, VALIDATION_LIMITS.RESENA_MAX_LENGTH)) {
        errors.push({
          field: 'descripcion',
          message: `La descripción debe tener entre ${VALIDATION_LIMITS.RESENA_MIN_LENGTH} y ${VALIDATION_LIMITS.RESENA_MAX_LENGTH} caracteres`,
        });
      }
    }

    if (errors.length > 0) {
      throw createValidationError(errors);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para validar creación de laboratorio
 */
export const validateLaboratorio = validate({
  id_distrito: {
    required: true,
    type: 'number',
    custom: (value) => isValidId(value),
    message: 'ID de distrito inválido',
  },
  nombre_laboratorio: {
    required: true,
    type: 'string',
    minLength: VALIDATION_LIMITS.LAB_NOMBRE_MIN_LENGTH,
    maxLength: VALIDATION_LIMITS.LAB_NOMBRE_MAX_LENGTH,
  },
  direccion: {
    required: true,
    type: 'string',
    maxLength: VALIDATION_LIMITS.LAB_DIRECCION_MAX_LENGTH,
  },
  correo_electronico: {
    required: true,
    type: 'email',
  },
  telefono: {
    required: true,
    type: 'phone',
  },
});

/**
 * Middleware para validar parámetros ID
 * Verifica que el parámetro de ruta sea un ID válido
 * 
 * @param paramName Nombre del parámetro a validar
 * @returns Middleware de Express
 * 
 * @example
 * ```typescript
 * router.get('/products/:id', validateIdParam('id'), getProduct);
 * ```
 */
export const validateIdParam = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params[paramName];

      if (!isValidId(id)) {
        throw new BadRequestError(`El parámetro ${paramName} debe ser un número entero positivo`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};