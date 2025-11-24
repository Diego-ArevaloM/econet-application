/**
 * ============================================
 * PRODUCTO CONTROLLER
 * ============================================
 * Controlador para endpoints de productos
 */

import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, getPaginationParams } from '../utils/apiResponse';
import { CreateProductoDto, UpdateProductoDto, ProductoFiltros } from '../types';

export class ProductoController {
  /**
   * GET /api/productos
   * Obtener todos los productos con filtros y paginación
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationParams(req.query);

    // Extraer filtros
    const filtros: ProductoFiltros = {
      tipo: req.query.tipo as string,
      forma: req.query.forma as string,
      objetivo_salud: req.query.objetivo_salud as string,
      laboratorio: req.query.laboratorio as string,
      busqueda: req.query.busqueda as string,
    };

    const result = await ProductoService.getAll(filtros, page, limit);

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: result.productos,
      paginacion: result.paginacion,
    });
  });

  /**
   * GET /api/productos/:id
   * Obtener un producto por ID
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const producto = await ProductoService.getById(id);

    sendSuccess(res, producto, 'Producto obtenido exitosamente');
  });

  /**
   * POST /api/productos
   * Crear un nuevo producto
   * Requiere autenticación de administrador
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const productoData: CreateProductoDto = req.body;

    const result = await ProductoService.create(productoData);

    sendCreated(res, { id: result.id }, result.message);
  });

  /**
   * PUT /api/productos/:id
   * Actualizar un producto
   * Requiere autenticación de administrador
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updateData: UpdateProductoDto = req.body;

    const result = await ProductoService.update(id, updateData);

    sendSuccess(res, null, result.message);
  });

  /**
   * DELETE /api/productos/:id
   * Eliminar un producto
   * Requiere autenticación de administrador
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const result = await ProductoService.delete(id);

    sendSuccess(res, null, result.message);
  });

  /**
   * GET /api/productos/search
   * Buscar productos
   */
  static search = asyncHandler(async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    const productos = await ProductoService.search(searchTerm, limit);

    sendSuccess(res, productos, 'Búsqueda completada exitosamente');
  });

  /**
   * GET /api/productos/laboratorio/:laboratorioId
   * Obtener productos de un laboratorio
   */
  static getByLaboratorio = asyncHandler(async (req: Request, res: Response) => {
    const laboratorioId = parseInt(req.params.laboratorioId);

    const productos = await ProductoService.getByLaboratorio(laboratorioId);

    sendSuccess(
      res,
      productos,
      'Productos del laboratorio obtenidos exitosamente'
    );
  });

  /**
   * GET /api/productos/top-rated
   * Obtener productos mejor calificados
   */
  static getTopRated = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;

    const productos = await ProductoService.getTopRated(limit);

    sendSuccess(
      res,
      productos,
      'Productos mejor calificados obtenidos exitosamente'
    );
  });

  /**
   * POST /api/productos/:id/images
   * Agregar imagen a un producto
   * Requiere autenticación de administrador
   */
  static addImage = asyncHandler(async (req: Request, res: Response) => {
    const productoId = parseInt(req.params.id);
    const { imagen_url, tipo, orden } = req.body;

    const result = await ProductoService.addImage(
      productoId,
      imagen_url,
      tipo,
      orden
    );

    sendCreated(res, { id: result.id }, result.message);
  });

  /**
   * GET /api/productos/:id/images
   * Obtener imágenes de un producto
   */
  static getImages = asyncHandler(async (req: Request, res: Response) => {
    const productoId = parseInt(req.params.id);

    const imagenes = await ProductoService.getImages(productoId);

    sendSuccess(res, imagenes, 'Imágenes obtenidas exitosamente');
  });

  /**
   * GET /api/productos/stats/general
   * Obtener estadísticas generales de productos
   */
  static getGeneralStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await ProductoService.getGeneralStats();

    sendSuccess(res, stats, 'Estadísticas obtenidas exitosamente');
  });
}