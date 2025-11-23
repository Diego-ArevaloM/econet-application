/**
 * ============================================
 * TIPOS PARA OPERACIONES DE BASE DE DATOS
 * ============================================
 * Define tipos específicos para queries y resultados de PostgreSQL
 */

import { QueryResult, QueryResultRow } from 'pg';

// ============================================
// TIPOS DE RESULTADO DE QUERIES
// ============================================

/**
 * Resultado de una operación INSERT
 */
export interface InsertResult {
  id: number;
  rowCount: number;
}

/**
 * Resultado de una operación UPDATE
 */
export interface UpdateResult {
  rowCount: number;
  success: boolean;
}

/**
 * Resultado de una operación DELETE
 */
export interface DeleteResult {
  rowCount: number;
  success: boolean;
}

/**
 * Resultado de una query de conteo
 */
export interface CountResult {
  count: number;
}

/**
 * Resultado de una query EXISTS
 */
export interface ExistsResult {
  exists: boolean;
}

// ============================================
// TIPOS PARA TRANSACCIONES
// ============================================

/**
 * Callback para operaciones dentro de una transacción
 */
export type TransactionCallback<T> = (client: any) => Promise<T>;

/**
 * Opciones para transacciones
 */
export interface TransactionOptions {
  isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
  readOnly?: boolean;
  deferrable?: boolean;
}

// ============================================
// TIPOS PARA QUERIES DINÁMICAS
// ============================================

/**
 * Operadores de comparación para WHERE
 */
export type WhereOperator = 
  | '=' 
  | '!=' 
  | '>' 
  | '>=' 
  | '<' 
  | '<=' 
  | 'LIKE' 
  | 'ILIKE' 
  | 'IN' 
  | 'NOT IN'
  | 'IS NULL'
  | 'IS NOT NULL';

/**
 * Condición WHERE para queries dinámicas
 */
export interface WhereCondition {
  field: string;
  operator: WhereOperator;
  value?: any;
}

/**
 * Opciones de ordenamiento
 */
export interface OrderByOption {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Opciones para queries SELECT
 */
export interface SelectOptions {
  fields?: string[];
  where?: WhereCondition[];
  orderBy?: OrderByOption[];
  limit?: number;
  offset?: number;
}

// ============================================
// TIPOS PARA JOINS
// ============================================

/**
 * Tipo de JOIN
 */
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

/**
 * Configuración de JOIN
 */
export interface JoinConfig {
  type: JoinType;
  table: string;
  alias?: string;
  on: string;
}

// ============================================
// TIPOS ROW MAPPING
// ============================================

/**
 * Mapeo de nombres de columnas de DB a propiedades de objeto
 */
export type ColumnMapping<T> = {
  [K in keyof T]?: string;
};

/**
 * Función para transformar row de DB a objeto
 */
export type RowMapper<T> = (row: any) => T;

// ============================================
// ERRORES DE BASE DE DATOS
// ============================================

/**
 * Códigos de error comunes de PostgreSQL
 */
export enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  CHECK_VIOLATION = '23514',
  INVALID_TEXT_REPRESENTATION = '22P02',
  NUMERIC_VALUE_OUT_OF_RANGE = '22003',
}

/**
 * Error de PostgreSQL extendido
 */
export interface PostgresError extends Error {
  code: string;
  detail?: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: string;
  routine?: string;
}

// ============================================
// TIPOS PARA BULK OPERATIONS
// ============================================

/**
 * Opciones para operaciones en masa
 */
export interface BulkInsertOptions {
  batchSize?: number;
  onConflict?: 'DO NOTHING' | 'DO UPDATE';
  conflictTarget?: string[];
  updateFields?: string[];
}

/**
 * Resultado de operación en masa
 */
export interface BulkOperationResult {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

// ============================================
// TIPOS PARA RAW QUERIES
// ============================================

/**
 * Parámetros parametrizados para queries
 */
export type QueryParams = Array<string | number | boolean | null | Date>;

/**
 * Configuración de query raw
 */
export interface RawQueryConfig {
  text: string;
  values?: QueryParams;
  rowMode?: 'array';
  types?: any;
}

// ============================================
// TIPOS PARA AGREGACIONES
// ============================================

/**
 * Funciones de agregación
 */
export type AggregateFunction = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

/**
 * Configuración de agregación
 */
export interface AggregateConfig {
  function: AggregateFunction;
  field: string;
  alias?: string;
}

/**
 * Resultado de agregación genérico
 */
export interface AggregateResult {
  [key: string]: number | string;
}

// ============================================
// TIPOS PARA ÍNDICES Y PERFORMANCE
// ============================================

/**
 * Información de índice
 */
export interface IndexInfo {
  schemaname: string;
  tablename: string;
  indexname: string;
  indexdef: string;
}

/**
 * Estadísticas de query
 */
export interface QueryStats {
  executionTime: number;
  planningTime?: number;
  totalTime: number;
  rowsReturned: number;
}

// ============================================
// HELPERS DE TIPO
// ============================================

/**
 * Convierte un tipo a nullable
 */
export type Nullable<T> = T | null;

/**
 * Convierte un tipo a opcional
 */
export type Optional<T> = T | undefined;

/**
 * Hace todas las propiedades de un tipo opcionales excepto las especificadas
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Hace todas las propiedades de un tipo requeridas excepto las especificadas
 */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

/**
 * Row de la base de datos (genérico)
 */
export type DbRow = QueryResultRow;

/**
 * Resultado de query con tipo genérico
 */
export type TypedQueryResult<T extends QueryResultRow = any> = QueryResult<T> & {
  rows: T[];
};