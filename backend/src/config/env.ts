import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Interfaz de configuración de la aplicación
 * Define todas las variables de entorno requeridas
 */
interface Config {
  // Servidor
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  
  // Base de datos
  DATABASE_URL: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // CORS
  FRONTEND_URL: string;
  
  // Opcional: Configuraciones adicionales
  MAX_FILE_SIZE: number;
  RATE_LIMIT_MAX: number;
}

/**
 * Configuración de la aplicación
 * Exporta todas las variables de entorno tipadas
 */
export const config: Config = {
  // Servidor
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  
  // Base de datos
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Configuraciones adicionales
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB por defecto
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 * @throws {Error} Si falta alguna variable crítica
 */
export function validateEnv(): void {
  const requiredEnvVars: (keyof Config)[] = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missing: string[] = [];

  requiredEnvVars.forEach((key) => {
    if (!config[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('\n❌ ERROR: Faltan variables de entorno requeridas:');
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Asegúrate de tener un archivo .env con todas las variables necesarias.\n');
    process.exit(1);
  }

  // Validaciones adicionales
  if (config.PORT < 1 || config.PORT > 65535) {
    console.error('❌ ERROR: PORT debe estar entre 1 y 65535');
    process.exit(1);
  }

  if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
    console.error('❌ ERROR: NODE_ENV debe ser "development", "production" o "test"');
    process.exit(1);
  }

  // Validar formato de DATABASE_URL
  if (!config.DATABASE_URL.startsWith('postgresql://') && !config.DATABASE_URL.startsWith('postgres://')) {
    console.error('❌ ERROR: DATABASE_URL debe comenzar con "postgresql://" o "postgres://"');
    process.exit(1);
  }

  if (config.NODE_ENV === 'development') {
    console.log('✅ Variables de entorno validadas correctamente');
  }
}

/**
 * Verifica si estamos en modo desarrollo
 */
export const isDevelopment = (): boolean => config.NODE_ENV === 'development';

/**
 * Verifica si estamos en modo producción
 */
export const isProduction = (): boolean => config.NODE_ENV === 'production';

/**
 * Verifica si estamos en modo test
 */
export const isTest = (): boolean => config.NODE_ENV === 'test';