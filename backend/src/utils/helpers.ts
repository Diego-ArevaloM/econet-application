/**
 * ============================================
 * HELPER FUNCTIONS
 * ============================================
 * Funciones auxiliares generales
 */

/**
 * Genera un ID único (UUID v4 simple)
 * 
 * @returns String único
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Espera un tiempo determinado (útil para testing y rate limiting)
 * 
 * @param ms Milisegundos a esperar
 * @returns Promise que se resuelve después del tiempo
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Capitaliza la primera letra de una cadena
 * 
 * @param str Cadena a capitalizar
 * @returns Cadena capitalizada
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra en una cadena
 * 
 * @param str Cadena a capitalizar
 * @returns Cadena con cada palabra capitalizada
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Trunca una cadena a una longitud máxima
 * 
 * @param str Cadena a truncar
 * @param maxLength Longitud máxima
 * @param suffix Sufijo a agregar (default: '...')
 * @returns Cadena truncada
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Elimina acentos de una cadena
 * 
 * @param str Cadena a procesar
 * @returns Cadena sin acentos
 */
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Convierte una cadena a slug (URL-friendly)
 * 
 * @param str Cadena a convertir
 * @returns Slug
 * 
 * @example
 * ```typescript
 * slugify('Vitamina C para el sistema inmune') 
 * // 'vitamina-c-para-el-sistema-inmune'
 * ```
 */
export const slugify = (str: string): string => {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calcula el promedio de un array de números
 * 
 * @param numbers Array de números
 * @returns Promedio
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

/**
 * Redondea un número a N decimales
 * 
 * @param value Valor a redondear
 * @param decimals Número de decimales
 * @returns Valor redondeado
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Calcula el promedio de calificaciones y lo redondea
 * 
 * @param ratings Objeto con las calificaciones
 * @returns Promedio redondeado a 1 decimal
 */
export const calculateAverageRating = (ratings: {
  cat_efectividad: number;
  cat_valor_precio: number;
  cat_facilidad_uso: number;
  cat_calidad: number;
}): number => {
  const avg = average([
    ratings.cat_efectividad,
    ratings.cat_valor_precio,
    ratings.cat_facilidad_uso,
    ratings.cat_calidad,
  ]);
  return roundTo(avg, 1);
};

/**
 * Formatea un número a moneda (PEN - Soles)
 * 
 * @param amount Monto
 * @returns String formateado
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
};

/**
 * Formatea una fecha a formato legible en español
 * 
 * @param date Fecha
 * @returns String formateado
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

/**
 * Formatea una fecha con hora
 * 
 * @param date Fecha
 * @returns String formateado
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Calcula el tiempo transcurrido desde una fecha (tiempo relativo)
 * 
 * @param date Fecha
 * @returns String descriptivo ('hace 2 horas', 'hace 3 días', etc.)
 */
export const timeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      const plural = interval === 1 ? '' : 's';
      return `hace ${interval} ${name}${plural}`;
    }
  }

  return 'justo ahora';
};

/**
 * Genera un rango de números
 * 
 * @param start Inicio
 * @param end Fin (inclusivo)
 * @param step Incremento
 * @returns Array de números
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Agrupa un array por una propiedad
 * 
 * @param array Array a agrupar
 * @param key Propiedad por la cual agrupar
 * @returns Objeto agrupado
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Remueve elementos duplicados de un array
 * 
 * @param array Array con posibles duplicados
 * @returns Array sin duplicados
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Remueve duplicados de un array de objetos por una propiedad
 * 
 * @param array Array de objetos
 * @param key Propiedad única
 * @returns Array sin duplicados
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Mezcla aleatoriamente un array
 * 
 * @param array Array a mezclar
 * @returns Array mezclado
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Selecciona N elementos aleatorios de un array
 * 
 * @param array Array original
 * @param count Cantidad de elementos a seleccionar
 * @returns Array con elementos aleatorios
 */
export const sample = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Verifica si un objeto está vacío
 * 
 * @param obj Objeto a verificar
 * @returns true si está vacío
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Deep clone de un objeto (sin funciones)
 * 
 * @param obj Objeto a clonar
 * @returns Clon profundo
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Combina múltiples objetos (merge)
 * 
 * @param objects Objetos a combinar
 * @returns Objeto combinado
 */
export const merge = <T extends object>(...objects: Partial<T>[]): T => {
  return Object.assign({}, ...objects) as T;
};

/**
 * Pick: Selecciona propiedades específicas de un objeto
 * 
 * @param obj Objeto original
 * @param keys Propiedades a seleccionar
 * @returns Objeto con solo las propiedades seleccionadas
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit: Excluye propiedades específicas de un objeto
 * 
 * @param obj Objeto original
 * @param keys Propiedades a excluir
 * @returns Objeto sin las propiedades excluidas
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};