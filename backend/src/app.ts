/**
 * ============================================
 * APP.TS - ACTUALIZADO
 * ============================================
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config, isDevelopment } from './config/env';

// Importar middlewares
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFound } from './middleware/notFound.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';

// Importar rutas centralizadas
import routes from './routes';

const app: Application = express();

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());

// ============================================
// MIDDLEWARES DE PARSEO
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// LOGGING
// ============================================

if (isDevelopment()) {
  app.use(morgan('dev'));
  app.use(requestLogger);
} else {
  app.use(morgan('combined'));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Econet API - Sistema de información de productos naturales',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      resenas: '/api/resenas',
      laboratorios: '/api/laboratorios',
      ubicaciones: '/api/ubicaciones',
    },
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api', routes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - Ruta no encontrada
app.use(notFound);

// Error handler global
app.use(errorHandler);

export default app;