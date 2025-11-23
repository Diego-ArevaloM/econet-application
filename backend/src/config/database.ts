import { Pool, PoolClient, QueryResult, PoolConfig } from 'pg';
import { config, isDevelopment } from './env';

/**
 * Interfaz para las estadísticas del pool de conexiones
 */
interface PoolStats {
  totalCount: number;
  idleCount: number;
  waitingCount: number;
}

/**
 * Clase Database con patrón Singleton
 * Maneja el pool de conexiones a PostgreSQL
 */
class Database {
  private pool: Pool;
  private static instance: Database;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {
    const poolConfig: PoolConfig = {
      connectionString: config.DATABASE_URL,
      // Configuración SSL para producción
      ssl: config.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
      // Configuración del pool
      max: 20,                      // Máximo de clientes en el pool
      idleTimeoutMillis: 30000,     // Tiempo antes de cerrar cliente inactivo
      connectionTimeoutMillis: 5000, // Tiempo máximo de espera para conexión
    };

    this.pool = new Pool(poolConfig);

    // Event listeners para monitoreo
    this.setupEventListeners();
  }

  /**
   * Configura los event listeners del pool
   */
  private setupEventListeners(): void {
    // Evento: Nueva conexión establecida
    this.pool.on('connect', (client: PoolClient) => {
      if (isDevelopment()) {
        console.log('🔗 Nueva conexión establecida en el pool');
      }
    });

    // Evento: Error en cliente inactivo
    this.pool.on('error', (err: Error, client: PoolClient) => {
      console.error('❌ Error inesperado en cliente de PostgreSQL:', err);
      console.error('Stack:', err.stack);
    });

    // Evento: Cliente removido del pool
    this.pool.on('remove', (client: PoolClient) => {
      if (isDevelopment()) {
        console.log('🔌 Cliente removido del pool');
      }
    });

    // Evento: Cliente adquirido del pool
    this.pool.on('acquire', (client: PoolClient) => {
      if (isDevelopment()) {
        console.log('📥 Cliente adquirido del pool');
      }
    });
  }

  /**
   * Obtiene la instancia única de Database (Singleton)
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Obtiene el pool de conexiones
   */
  public getPool(): Pool {
    return this.pool;
  }

  /**
   * Ejecuta una query simple
   * @param text SQL query
   * @param params Parámetros de la query
   * @returns Resultado de la query
   */
  public async query<T extends Record<string, any> = any>(
    text: string, 
    params?: any[]
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;

      // Log en desarrollo
      if (isDevelopment()) {
        console.log('🔍 Query ejecutado:', {
          text: text.length > 100 ? text.substring(0, 100) + '...' : text,
          duration: `${duration}ms`,
          rows: result.rowCount,
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Error ejecutando query:');
      console.error('Query:', text);
      console.error('Params:', params);
      console.error('Error:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una transacción
   * @param callback Función que contiene las operaciones de la transacción
   * @returns Resultado de la transacción
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      if (isDevelopment()) {
        console.log('🔄 Transacción iniciada');
      }

      const result = await callback(client);
      
      await client.query('COMMIT');
      
      if (isDevelopment()) {
        console.log('✅ Transacción completada');
      }

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      
      if (isDevelopment()) {
        console.log('🔙 Transacción revertida');
      }

      console.error('❌ Error en transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Prueba la conexión a la base de datos
   * @returns true si la conexión es exitosa
   */
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.pool.query<{ now: Date; version: string }>(
        'SELECT NOW() as now, version() as version'
      );
      const { now, version } = result.rows[0];
      
      console.log('✅ Conexión a PostgreSQL exitosa');
      console.log(`📅 Fecha del servidor: ${now}`);
      console.log(`🐘 Versión de PostgreSQL: ${version.split(',')[0]}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con PostgreSQL:');
      console.error(error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas del pool de conexiones
   */
  public getPoolStats(): PoolStats {
    return {
      totalCount: this.pool.totalCount,   // Total de clientes en el pool
      idleCount: this.pool.idleCount,     // Clientes inactivos
      waitingCount: this.pool.waitingCount, // Clientes esperando
    };
  }

  /**
   * Cierra todas las conexiones del pool
   * Debe llamarse al apagar la aplicación
   */
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      console.log('🔒 Pool de conexiones cerrado correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar el pool:', error);
      throw error;
    }
  }

  /**
   * Verifica la salud de la base de datos
   * Útil para health checks
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    responseTime: number;
    poolStats: PoolStats;
  }> {
    const start = Date.now();
    
    try {
      await this.pool.query('SELECT 1');
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        poolStats: this.getPoolStats(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        poolStats: this.getPoolStats(),
      };
    }
  }
}

// Exportar instancia única
export const db = Database.getInstance();

// Exportar pool directamente (para casos específicos)
export const pool = db.getPool();

// Export por defecto
export default pool;