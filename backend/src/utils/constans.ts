/**
 * ============================================
 * CONSTANTS
 * ============================================
 * Constantes globales de la aplicación
 */

// ============================================
// TIPOS DE USUARIO
// ============================================

export const USER_TYPES = {
  CLIENTE: 'cliente' as const,
  ADMINISTRADOR: 'administrador' as const,
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

// ============================================
// ESTADOS DE PRODUCTOS
// ============================================

export const PRODUCT_STATES = {
  DISPONIBLE: 'Disponible' as const,
  AGOTADO: 'Agotado' as const,
  DESCONTINUADO: 'Descontinuado' as const,
} as const;

export type ProductState = typeof PRODUCT_STATES[keyof typeof PRODUCT_STATES];

// ============================================
// TIPOS DE IMÁGENES
// ============================================

export const IMAGE_TYPES = {
  PRINCIPAL: 'principal' as const,
  SECUNDARIA: 'secundaria' as const,
} as const;

export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES];

// ============================================
// LÍMITES Y VALIDACIONES
// ============================================

export const VALIDATION_LIMITS = {
  // Usuarios
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 45,
  EMAIL_MAX_LENGTH: 90,
  PASSWORD_MIN_LENGTH: 8,
  
  // Productos
  DESCRIPCION_MIN_LENGTH: 10,
  DESCRIPCION_MAX_LENGTH: 5000,
  TIPO_MAX_LENGTH: 60,
  FORMA_MAX_LENGTH: 60,
  
  // Reseñas
  RESENA_MIN_LENGTH: 10,
  RESENA_MAX_LENGTH: 1000,
  RATING_MIN: 0,
  RATING_MAX: 5,
  
  // Laboratorios
  LAB_NOMBRE_MIN_LENGTH: 3,
  LAB_NOMBRE_MAX_LENGTH: 90,
  LAB_DIRECCION_MAX_LENGTH: 90,
  LAB_TELEFONO_LENGTH: 9,
  
  // Paginación
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  
  // Archivos
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// ============================================
// MENSAJES DE ERROR
// ============================================

export const ERROR_MESSAGES = {
  // Autenticación
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_TOKEN: 'Token inválido',
  TOKEN_EXPIRED: 'Token expirado',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'No tienes permisos para esta acción',
  
  // Validación
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_RATING: 'La calificación debe estar entre 0 y 5',
  
  // Recursos
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  LABORATORY_NOT_FOUND: 'Laboratorio no encontrado',
  REVIEW_NOT_FOUND: 'Reseña no encontrada',
  RESOURCE_NOT_FOUND: 'Recurso no encontrado',
  
  // Conflictos
  REVIEW_ALREADY_EXISTS: 'Ya has dejado una reseña para este producto',
  DUPLICATE_ENTRY: 'El registro ya existe',
  
  // Servidor
  INTERNAL_ERROR: 'Error interno del servidor',
  DATABASE_ERROR: 'Error en la base de datos',
  SERVICE_UNAVAILABLE: 'Servicio temporalmente no disponible',
} as const;

// ============================================
// MENSAJES DE ÉXITO
// ============================================

export const SUCCESS_MESSAGES = {
  // Autenticación
  REGISTER_SUCCESS: 'Usuario registrado exitosamente',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  
  // CRUD
  CREATED: 'Recurso creado exitosamente',
  UPDATED: 'Recurso actualizado exitosamente',
  DELETED: 'Recurso eliminado exitosamente',
  
  // Específicos
  PRODUCT_CREATED: 'Producto creado exitosamente',
  REVIEW_CREATED: 'Reseña publicada exitosamente',
  REVIEW_UPDATED: 'Reseña actualizada exitosamente',
  REVIEW_DELETED: 'Reseña eliminada exitosamente',
} as const;

// ============================================
// CÓDIGOS HTTP
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================
// ORDEN Y FILTROS
// ============================================

export const ORDER_DIRECTIONS = {
  ASC: 'ASC' as const,
  DESC: 'DESC' as const,
} as const;

export const PRODUCT_ORDER_FIELDS = {
  FECHA_AGREGACION: 'fecha_agregacion',
  NOMBRE_LABORATORIO: 'nombre_laboratorio',
  TIPO: 'tipo',
  PROMEDIO_CALIFICACION: 'promedio_calificacion',
  CANTIDAD_RESENAS: 'cantidad_resenas',
} as const;

// ============================================
// CONFIGURACIÓN JWT
// ============================================

export const JWT_CONFIG = {
  ISSUER: 'econet-api',
  AUDIENCE: 'econet-client',
  DEFAULT_EXPIRATION: '7d',
  REFRESH_EXPIRATION: '30d',
  EXPIRY_THRESHOLD_MINUTES: 5, // Para verificar si está por expirar
} as const;

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMITS = {
  DEFAULT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 5, // Solo 5 intentos de login
  },
  CREATE: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hora
    MAX_REQUESTS: 10, // Máximo 10 creaciones por hora
  },
} as const;

// ============================================
// REGEX PATTERNS
// ============================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PE: /^(\+51|51)?[9]\d{8}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMBERS_ONLY: /^\d+$/,
} as const;

// ============================================
// TIPOS DE CONTENIDO
// ============================================

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
} as const;

// ============================================
// HEADERS
// ============================================

export const HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  X_REQUEST_ID: 'X-Request-ID',
  X_RESPONSE_TIME: 'X-Response-Time',
} as const;

// ============================================
// FORMATOS DE FECHA
// ============================================

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
} as const;

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================

export const CORS_CONFIG = {
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  CREDENTIALS: true,
  MAX_AGE: 86400, // 24 horas
} as const;