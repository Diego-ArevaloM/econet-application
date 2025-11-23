/**
 * ============================================
 * VALIDATORS
 * ============================================
 * Funciones de validación personalizadas
 */

/**
 * Valida formato de email
 * 
 * @param email Email a validar
 * @returns true si es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida contraseña segura
 * Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número
 * 
 * @param password Contraseña a validar
 * @returns true si es válida
 */
export const isValidPassword = (password: string): boolean => {
  // Mínimo 8 caracteres
  if (password.length < 8) {
    return false;
  }

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Al menos una minúscula
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    return false;
  }

  return true;
};

/**
 * Obtiene los requisitos faltantes de una contraseña
 * 
 * @param password Contraseña a validar
 * @returns Array de requisitos faltantes
 */
export const getPasswordRequirements = (password: string): string[] => {
  const requirements: string[] = [];

  if (password.length < 8) {
    requirements.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    requirements.push('Al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    requirements.push('Al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    requirements.push('Al menos un número');
  }

  return requirements;
};

/**
 * Valida formato de teléfono peruano
 * Formatos aceptados: 999999999, +51999999999, 51999999999
 * 
 * @param phone Teléfono a validar
 * @returns true si es válido
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+51|51)?[9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida que una calificación esté en el rango válido (0-5)
 * 
 * @param rating Calificación a validar
 * @returns true si está en el rango
 */
export const isValidRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5;
};

/**
 * Valida que todas las calificaciones de una reseña sean válidas
 * 
 * @param ratings Objeto con las calificaciones
 * @returns true si todas son válidas
 */
export const areValidRatings = (ratings: {
  cat_efectividad: number;
  cat_valor_precio: number;
  cat_facilidad_uso: number;
  cat_calidad: number;
}): boolean => {
  return (
    isValidRating(ratings.cat_efectividad) &&
    isValidRating(ratings.cat_valor_precio) &&
    isValidRating(ratings.cat_facilidad_uso) &&
    isValidRating(ratings.cat_calidad)
  );
};

/**
 * Valida que una URL sea válida
 * 
 * @param url URL a validar
 * @returns true si es válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida que una cadena no esté vacía después de hacer trim
 * 
 * @param str Cadena a validar
 * @returns true si no está vacía
 */
export const isNotEmpty = (str: string): boolean => {
  return str.trim().length > 0;
};

/**
 * Valida longitud de cadena
 * 
 * @param str Cadena a validar
 * @param min Longitud mínima
 * @param max Longitud máxima
 * @returns true si está en el rango
 */
export const isValidLength = (str: string, min: number, max: number): boolean => {
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida que un valor sea un número entero positivo
 * 
 * @param value Valor a validar
 * @returns true si es entero positivo
 */
export const isPositiveInteger = (value: any): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Valida que un ID sea válido
 * 
 * @param id ID a validar
 * @returns true si es válido
 */
export const isValidId = (id: any): boolean => {
  return isPositiveInteger(id);
};

/**
 * Sanitiza una cadena removiendo caracteres especiales peligrosos
 * 
 * @param str Cadena a sanitizar
 * @returns Cadena sanitizada
 */
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/\0/g, ''); // Remover null bytes
};

/**
 * Valida formato de fecha (YYYY-MM-DD)
 * 
 * @param dateStr Fecha en formato string
 * @returns true si es válida
 */
export const isValidDate = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Valida que una fecha no sea futura
 * 
 * @param dateStr Fecha en formato string
 * @returns true si no es futura
 */
export const isNotFutureDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  return date <= now;
};

/**
 * Valida parámetros de paginación
 * 
 * @param page Página
 * @param limit Límite
 * @returns Objeto con valores validados
 */
export const validatePaginationParams = (
  page: any,
  limit: any
): { page: number; limit: number; isValid: boolean } => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const isValid = 
    isPositiveInteger(pageNum) &&
    isPositiveInteger(limitNum) &&
    limitNum <= 100; // Máximo 100 items por página

  return {
    page: isValid ? pageNum : 1,
    limit: isValid ? Math.min(limitNum, 100) : 10,
    isValid,
  };
};

/**
 * Valida un objeto contra un schema simple
 * 
 * @param obj Objeto a validar
 * @param schema Schema de validación
 * @returns Array de errores (vacío si es válido)
 * 
 * @example
 * ```typescript
 * const errors = validateObject(user, {
 *   nombres: { required: true, minLength: 2 },
 *   email: { required: true, email: true }
 * });
 * ```
 */
export const validateObject = (
  obj: any,
  schema: Record<string, any>
): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];

    // Required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `El campo ${field} es requerido` });
      continue;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      continue;
    }

    // Email
    if (rules.email && !isValidEmail(value)) {
      errors.push({ field, message: `Email inválido` });
    }

    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      errors.push({ 
        field, 
        message: `Mínimo ${rules.minLength} caracteres` 
      });
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push({ 
        field, 
        message: `Máximo ${rules.maxLength} caracteres` 
      });
    }

    // Custom validator
    if (rules.validator && typeof rules.validator === 'function') {
      const isValid = rules.validator(value);
      if (!isValid) {
        errors.push({ 
          field, 
          message: rules.message || `Valor inválido para ${field}` 
        });
      }
    }
  }

  return errors;
};