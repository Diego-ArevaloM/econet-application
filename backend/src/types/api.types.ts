/**
 * ============================================
 * TIPOS PARA LA API
 * ============================================
 * Define la estructura de las respuestas y requests
 */

// ============================================
// RESPUESTAS ESTANDARIZADAS
// ============================================

/**
 * Respuesta exitosa estándar
 */
export interface ApiResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  timestamp?: string;
}

/**
 * Respuesta de error estándar
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  details?: any;
  timestamp?: string;
  path?: string;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  success: true;
  message: string;
  token: string;
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    correo_electronico: string;
    tipo_usuario: 'cliente' | 'administrador';
  };
}

/**
 * Respuesta de registro
 */
export interface RegisterResponse {
  success: true;
  message: string;
  userId: number;
}

// ============================================
// VALIDACIÓN DE CAMPOS
// ============================================

/**
 * Errores de validación por campo
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Respuesta de error de validación
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
  errors: ValidationError[];
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Respuesta de health check
 */
export interface HealthCheckResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
  uptime: number;
  environment: string;
  database?: {
    status: 'healthy' | 'unhealthy';
    responseTime: number;
  };
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
}

// ============================================
// PARÁMETROS DE QUERY
// ============================================

/**
 * Parámetros de paginación en query string
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Parámetros de búsqueda de productos
 */
export interface ProductoSearchQuery extends PaginationQuery {
  tipo?: string;
  forma?: string;
  objetivo_salud?: string;
  laboratorio?: string;
  busqueda?: string;
}

// ============================================
// REQUEST BODY TYPES
// ============================================

/**
 * Body para registro de usuario
 */
export interface RegisterRequestBody {
  nombres: string;
  apellidos: string;
  correo_electronico: string;
  contrasenia: string;
}

/**
 * Body para login
 */
export interface LoginRequestBody {
  correo_electronico: string;
  contrasenia: string;
}

/**
 * Body para crear producto
 */
export interface CreateProductoRequestBody {
  id_laboratorio: number;
  descripcion: string;
  tipo: string;
  forma: string;
  objetivo_salud: string;
  solos: string;
  imagen_url?: string;
}

/**
 * Body para crear reseña
 */
export interface CreateResenaRequestBody {
  id_producto: number;
  descripcion?: string;
  cat_efectividad: number;
  cat_valor_precio: number;
  cat_facilidad_uso: number;
  cat_calidad: number;
}

/**
 * Body para crear laboratorio
 */
export interface CreateLaboratorioRequestBody {
  id_distrito: number;
  nombre_laboratorio: string;
  direccion: string;
  correo_electronico: string;
  telefono: string;
}

// ============================================
// ROUTE PARAMS
// ============================================

/**
 * Parámetros de ruta comunes
 */
export interface IdParam {
  id: string;
}

export interface ProductoIdParam {
  productoId: string;
}

export interface ResenaIdParam {
  resenaId: string;
}

export interface LaboratorioIdParam {
  laboratorioId: string;
}

// ============================================
// METADATA
// ============================================

/**
 * Metadata de paginación
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Respuesta con paginación
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Estadísticas de un producto
 */
export interface ProductoStats {
  total_resenas: number;
  promedio_efectividad: number;
  promedio_precio: number;
  promedio_facilidad: number;
  promedio_calidad: number;
  promedio_general: number;
}

/**
 * Estadísticas de un laboratorio
 */
export interface LaboratorioStats {
  total_productos: number;
  total_resenas: number;
  promedio_general: number;
}

/**
 * Estadísticas del sistema (admin)
 */
export interface SystemStats {
  total_usuarios: number;
  total_productos: number;
  total_resenas: number;
  total_laboratorios: number;
  usuarios_activos_mes: number;
  productos_agregados_mes: number;
}

// ============================================
// TIPOS DE ARCHIVO
// ============================================

/**
 * Información de archivo subido
 */
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  url?: string;
}

/**
 * Respuesta de subida de archivo
 */
export interface FileUploadResponse {
  success: true;
  message: string;
  file: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
}