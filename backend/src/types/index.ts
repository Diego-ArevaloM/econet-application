/**
 * Interfaz para Usuario
 */
export interface Usuario {
  id_usuario?: number;
  nombres: string;
  apellidos: string;
  correo_electronico: string;
  fecha_registro?: Date;
  tipo_usuario: 'cliente' | 'administrador';
}

/**
 * Interfaz para Cuenta (credenciales)
 */
export interface Cuenta {
  id_cuentas?: number;
  id_usuario: number;
  correo_electronico: string;
  contrasenia: string;
}

/**
 * Interfaz para Administrador
 */
export interface Administrador {
  id_administrador?: number;
  id_usuario: number;
  permisos: string;
}

/**
 * Interfaz para crear un nuevo usuario
 */
export interface CreateUsuarioDto {
  nombres: string;
  apellidos: string;
  correo_electronico: string;
  contrasenia: string;
  tipo_usuario?: 'cliente' | 'administrador';
}

/**
 * Interfaz para login
 */
export interface LoginDto {
  correo_electronico: string;
  contrasenia: string;
}

/**
 * Payload del JWT
 */
export interface JwtPayload {
  id: number;
  email: string;
  tipo: 'cliente' | 'administrador';
}

// ============================================
// UBICACIONES
// ============================================

/**
 * Interfaz para Departamento
 */
export interface Departamento {
  id_departamento?: number;
  nombre_departamento: string;
}

/**
 * Interfaz para Provincia
 */
export interface Provincia {
  id_provincia?: number;
  id_departamento: number;
  nombre_provincia: string;
}

/**
 * Interfaz para Distrito
 */
export interface Distrito {
  id_distrito?: number;
  id_provincia: number;
  nombre_distrito: string;
}

/**
 * Interfaz para ubicación completa (con joins)
 */
export interface UbicacionCompleta {
  id_distrito: number;
  nombre_distrito: string;
  id_provincia: number;
  nombre_provincia: string;
  id_departamento: number;
  nombre_departamento: string;
}

// ============================================
// LABORATORIOS
// ============================================

/**
 * Interfaz para Laboratorio
 */
export interface Laboratorio {
  id_laboratorio?: number;
  id_distrito: number;
  nombre_laboratorio: string;
  direccion: string;
  correo_electronico: string;
  telefono: string;
}

/**
 * Interfaz para Laboratorio con ubicación completa
 */
export interface LaboratorioCompleto extends Laboratorio {
  nombre_distrito?: string;
  nombre_provincia?: string;
  nombre_departamento?: string;
}

/**
 * DTO para crear laboratorio
 */
export interface CreateLaboratorioDto {
  id_distrito: number;
  nombre_laboratorio: string;
  direccion: string;
  correo_electronico: string;
  telefono: string;
}

// ============================================
// PRODUCTOS
// ============================================

/**
 * Interfaz para Producto
 */
export interface Producto {
  id_producto?: number;
  id_laboratorio: number;
  descripcion: string;
  tipo: string;
  forma: string;
  objetivo_salud: string;
  solos: string;
  fecha_agregacion?: Date;
  imagen_url?: string;
}

/**
 * Interfaz para Producto con información adicional
 */
export interface ProductoCompleto extends Producto {
  // Información del laboratorio
  nombre_laboratorio?: string;
  lab_email?: string;
  telefono?: string;
  direccion?: string;
  
  // Calificaciones
  sum_a_nota_efectividad?: number;
  sum_a_nota_precio?: number;
  sum_a_facilidad_uso?: number;
  sum_a_calidad?: number;
  cantidad_resenas?: number;
  
  // Calificación promedio calculada
  promedio_calificacion?: number;
  
  // Imágenes
  imagenes?: ImagenProducto[];
}

/**
 * DTO para crear producto
 */
export interface CreateProductoDto {
  id_laboratorio: number;
  descripcion: string;
  tipo: string;
  forma: string;
  objetivo_salud: string;
  solos: string;
  imagen_url?: string;
}

/**
 * DTO para actualizar producto
 */
export interface UpdateProductoDto {
  descripcion?: string;
  tipo?: string;
  forma?: string;
  objetivo_salud?: string;
  solos?: string;
  imagen_url?: string;
}

/**
 * Filtros para búsqueda de productos
 */
export interface ProductoFiltros {
  tipo?: string;
  forma?: string;
  objetivo_salud?: string;
  laboratorio?: string;
  busqueda?: string;
}

// ============================================
// IMÁGENES DE PRODUCTOS
// ============================================

/**
 * Interfaz para Imagen de Producto
 */
export interface ImagenProducto {
  id_imagen?: number;
  id_producto: number;
  imagen_url: string;
  tipo?: string;
  orden?: string;
}

/**
 * DTO para agregar imagen
 */
export interface CreateImagenDto {
  id_producto: number;
  imagen_url: string;
  tipo?: 'principal' | 'secundaria';
  orden?: string;
}

// ============================================
// ESTADOS
// ============================================

/**
 * Interfaz para Estado
 */
export interface Estado {
  id_estado?: number;
  estado: 'Disponible' | 'Agotado' | 'Descontinuado';
}

/**
 * Interfaz para Estado de Usuario
 */
export interface EstadoUsuario {
  id_estado_usuario?: number;
  id_usuario: number;
  id_estado: number;
}

// ============================================
// CALIFICACIONES
// ============================================

/**
 * Interfaz para Calificación agregada de un producto
 */
export interface Calificacion {
  id_calificacion?: number;
  id_producto: number;
  sum_a_nota_efectividad: number;
  sum_a_nota_precio: number;
  sum_a_facilidad_uso: number;
  sum_a_calidad: number;
  cantidad_resenas: number;
}

/**
 * Interfaz para calificación promedio calculada
 */
export interface CalificacionPromedio {
  efectividad: number;
  precio: number;
  facilidad_uso: number;
  calidad: number;
  promedio_general: number;
  total_resenas: number;
}

// ============================================
// RESEÑAS
// ============================================

/**
 * Interfaz para Reseña
 */
export interface Resena {
  id_resena?: number;
  id_usuario: number;
  id_producto: number;
  descripcion?: string;
  cat_efectividad: number;
  cat_valor_precio: number;
  cat_facilidad_uso: number;
  cat_calidad: number;
  fecha_resena?: Date;
}

/**
 * Interfaz para Reseña completa (con información del usuario)
 */
export interface ResenaCompleta extends Resena {
  nombres?: string;
  apellidos?: string;
  nombre_completo?: string;
  promedio_individual?: number;
}

/**
 * DTO para crear reseña
 */
export interface CreateResenaDto {
  id_usuario: number;
  id_producto: number;
  descripcion?: string;
  cat_efectividad: number;
  cat_valor_precio: number;
  cat_facilidad_uso: number;
  cat_calidad: number;
}

/**
 * DTO para actualizar reseña
 */
export interface UpdateResenaDto {
  descripcion?: string;
  cat_efectividad?: number;
  cat_valor_precio?: number;
  cat_facilidad_uso?: number;
  cat_calidad?: number;
}

/**
 * Validación de calificación (debe estar entre 0 y 5)
 */
export type CalificacionValor = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

// ============================================
// SATISFACCIÓN GENERAL
// ============================================

/**
 * Interfaz para Satisfacción General
 */
export interface SatisfaccionGeneral {
  id_satisfaccion?: number;
  id_producto: number;
  valor_inscripcion: number;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

/**
 * Tipo para ordenamiento
 */
export type OrdenCampo = 
  | 'fecha_agregacion'
  | 'nombre_laboratorio'
  | 'tipo'
  | 'promedio_calificacion'
  | 'cantidad_resenas';

/**
 * Tipo para dirección de ordenamiento
 */
export type OrdenDireccion = 'ASC' | 'DESC';

/**
 * Opciones de paginación
 */
export interface PaginacionOpciones {
  pagina?: number;
  limite?: number;
  orden_campo?: OrdenCampo;
  orden_direccion?: OrdenDireccion;
}

/**
 * Respuesta paginada
 */
export interface RespuestaPaginada<T> {
  datos: T[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_registros: number;
    registros_por_pagina: number;
  };
}