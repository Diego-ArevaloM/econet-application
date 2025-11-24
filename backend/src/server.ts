/**
 * ============================================
 * SERVER.TS - PUNTO DE ENTRADA
 * ============================================
 * Inicializa el servidor Express y gestiona el ciclo de vida
 */

import app from './app';
import { config, validateEnv } from './config/env';
import { db } from './config/database';

// Validar variables de entorno al inicio
validateEnv();

/**
 * Función principal para iniciar el servidor
 */
const startServer = async () => {
  try {
    console.log('Iniciando servidor Econet...\n');

    // ============================================
    // PROBAR CONEXIÓN A LA BASE DE DATOS
    // ============================================
    
    console.log('Verificando conexión a PostgreSQL...');
    const isConnected = await db.testConnection();

    if (!isConnected) {
      console.error('No se pudo conectar a la base de datos');
      console.error('Verifica tu archivo .env y que PostgreSQL esté corriendo');
      process.exit(1);
    }

    // Mostrar estadísticas del pool
    const stats = db.getPoolStats();
    console.log('\nEstadísticas del pool de conexiones:');
    console.log(`   Total de conexiones: ${stats.totalCount}`);
    console.log(`   Conexiones inactivas: ${stats.idleCount}`);
    console.log(`   Conexiones esperando: ${stats.waitingCount}`);

    // ============================================
    // INICIAR SERVIDOR HTTP
    // ============================================

    const server = app.listen(config.PORT, () => {
      console.log('\nServidor iniciado exitosamente!');
      console.log('═══════════════════════════════════════════');
      console.log(`URL: http://localhost:${config.PORT}`);
      console.log(`Entorno: ${config.NODE_ENV}`);
      console.log(`Hora de inicio: ${new Date().toLocaleString('es-PE')}`);
      console.log('═══════════════════════════════════════════');
      console.log('\nEndpoints disponibles:');
      console.log(`   Auth:          http://localhost:${config.PORT}/api/auth`);
      console.log(`   Productos:     http://localhost:${config.PORT}/api/productos`);
      console.log(`   Reseñas:       http://localhost:${config.PORT}/api/resenas`);
      console.log(`   Laboratorios:  http://localhost:${config.PORT}/api/laboratorios`);
      console.log(`   Ubicaciones:   http://localhost:${config.PORT}/api/ubicaciones`);
      console.log(`   Health Check:  http://localhost:${config.PORT}/health`);
      console.log('\nPresiona CTRL+C para detener el servidor\n');
    });

    // ============================================
    // GRACEFUL SHUTDOWN
    // ============================================

    /**
     * Maneja el cierre graceful del servidor
     * Cierra conexiones activas y limpia recursos
     */
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n  Señal ${signal} recibida. Iniciando cierre graceful...`);

      // Cerrar servidor HTTP (deja de aceptar nuevas conexiones)
      server.close(async () => {
        console.log('Servidor HTTP cerrado');

        try {
          // Cerrar pool de conexiones de la base de datos
          await db.close();
          console.log('Cierre graceful completado');
          process.exit(0);
        } catch (error) {
          console.error('Error durante el cierre:', error);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos si no se completó
      setTimeout(() => {
        console.error('Forzando cierre después de timeout');
        process.exit(1);
      }, 10000);
    };

    // ============================================
    // LISTENERS DE SEÑALES DEL SISTEMA
    // ============================================

    // SIGTERM - Señal de terminación (común en producción)
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // SIGINT - Ctrl+C en la terminal
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================
    // MANEJO DE ERRORES NO CAPTURADOS
    // ============================================

    /**
     * Maneja promesas rechazadas no capturadas
     */
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error('UNHANDLED PROMISE REJECTION:');
      console.error('Razón:', reason);
      console.error('Promesa:', promise);

      // En producción, es mejor cerrar el servidor
      if (config.NODE_ENV === 'production') {
        console.error('Cerrando servidor debido a unhandled rejection...');
        gracefulShutdown('unhandledRejection');
      }
    });

    /**
     * Maneja excepciones no capturadas
     */
    process.on('uncaughtException', (error: Error) => {
      console.error('UNCAUGHT EXCEPTION:');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);

      // Las excepciones no capturadas son críticas, cerrar siempre
      console.error('Cerrando servidor debido a uncaught exception...');
      gracefulShutdown('uncaughtException');
    });

    /**
     * Evento cuando el proceso está por terminar
     */
    process.on('exit', (code) => {
      console.log(`\nProceso terminado con código: ${code}`);
    });

  } catch (error) {
    console.error('Error fatal al iniciar el servidor:');
    console.error(error);
    process.exit(1);
  }
};

// ============================================
// EJECUTAR SERVIDOR
// ============================================

startServer();