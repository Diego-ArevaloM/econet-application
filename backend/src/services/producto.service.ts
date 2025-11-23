/**
 * ============================================
 * PRODUCTO SERVICE
 * ============================================
 * Lógica de negocio para productos
 */

import { ProductoModel } from '../models/producto.model';
import { LaboratorioModel } from '../models/laboratorio.model';
import { CreateProductoDto, UpdateProductoDto, ProductoFiltros } from '../types';
import { 
  BadRequestError, 
  NotFoundError 
} from '../utils/apiError';
import { isValidLength, isNotEmpty } from '../utils/validators';
import { VALIDATION_LIMITS } from '../utils/constants';
import { calculatePaginationMeta } from '../utils/apiResponse';
import { calculateOffset } from '../utils/apiResponse';

export class ProductoService {
  /**
   * Obtener todos los productos con filtros y paginación
   */
  static async getAll(
    filtros?: ProductoFiltros,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    productos: any[];
    paginacion: {
      pagina_actual: number;
      total_paginas: number;
      total_registros: number;
      registros_por_pagina: number;
    };
  }> {
    // Validar paginación
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    // Obtener productos
    const productos = await ProductoModel.getAll(filtros);

    // Calcular paginación
    const totalProductos = productos.length;
    const offset = calculateOffset(page, limit);
    const productosPaginados = productos.slice(offset, offset + limit);
    const meta = calculatePaginationMeta(totalProductos, page, limit);

    return {
      productos: productosPaginados,
      paginacion: {
        pagina_actual: meta.currentPage,
        total_paginas: meta.totalPages,
        total_registros: meta.totalItems,
        registros_por_pagina: meta.itemsPerPage,
      },
    };
  }

  /**
   * Obtener producto por ID con información completa
   */
  static async getById(id: number): Promise<any> {
    const producto = await ProductoModel.getById(id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    return producto;
  }

  /**
   * Crear un nuevo producto
   * Solo administradores
   */
  static async create(productoData: CreateProductoDto): Promise<{
    id: number;
    message: string;
  }> {
    // Validar que el laboratorio existe
    const laboratorioExists = await LaboratorioModel.exists(productoData.id_laboratorio);
    if (!laboratorioExists) {
      throw new NotFoundError('El laboratorio especificado no existe');
    }

    // Validar descripción
    if (!isValidLength(
      productoData.descripcion,
      VALIDATION_LIMITS.DESCRIPCION_MIN_LENGTH,
      VALIDATION_LIMITS.DESCRIPCION_MAX_LENGTH
    )) {
      throw new BadRequestError(
        `La descripción debe tener entre ${VALIDATION_LIMITS.DESCRIPCION_MIN_LENGTH} y ${VALIDATION_LIMITS.DESCRIPCION_MAX_LENGTH} caracteres`
      );
    }

    // Validar campos requeridos
    if (!isNotEmpty(productoData.tipo)) {
      throw new BadRequestError('El tipo de producto es requerido');
    }

    if (!isNotEmpty(productoData.forma)) {
      throw new BadRequestError('La forma del producto es requerida');
    }

    if (!isNotEmpty(productoData.objetivo_salud)) {
      throw new BadRequestError('El objetivo de salud es requerido');
    }

    if (!isNotEmpty(productoData.solos)) {
      throw new BadRequestError('El campo "solos" es requerido');
    }

    // Crear producto
    const productoId = await ProductoModel.create(productoData);

    return {
      id: productoId,
      message: 'Producto creado exitosamente',
    };
  }

  /**
   * Actualizar producto
   * Solo administradores
   */
  static async update(
    id: number,
    updateData: UpdateProductoDto
  ): Promise<{ message: string }> {
    // Verificar que el producto existe
    const exists = await ProductoModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Validar descripción si se está actualizando
    if (updateData.descripcion) {
      if (!isValidLength(
        updateData.descripcion,
        VALIDATION_LIMITS.DESCRIPCION_MIN_LENGTH,
        VALIDATION_LIMITS.DESCRIPCION_MAX_LENGTH
      )) {
        throw new BadRequestError(
          `La descripción debe tener entre ${VALIDATION_LIMITS.DESCRIPCION_MIN_LENGTH} y ${VALIDATION_LIMITS.DESCRIPCION_MAX_LENGTH} caracteres`
        );
      }
    }

    // Actualizar
    const updated = await ProductoModel.update(id, updateData);

    if (!updated) {
      throw new BadRequestError('No se pudo actualizar el producto');
    }

    return {
      message: 'Producto actualizado exitosamente',
    };
  }

  /**
   * Eliminar producto
   * Solo administradores
   */
  static async delete(id: number): Promise<{ message: string }> {
    // Verificar que el producto existe
    const exists = await ProductoModel.exists(id);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Eliminar (cascada eliminará reseñas, calificaciones e imágenes)
    await ProductoModel.delete(id);

    return {
      message: 'Producto eliminado exitosamente',
    };
  }

  /**
   * Buscar productos
   */
  static async search(
    searchTerm: string,
    limit: number = 20
  ): Promise<any[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('El término de búsqueda debe tener al menos 2 caracteres');
    }

    if (limit < 1 || limit > 100) {
      limit = 20;
    }

    return await ProductoModel.search(searchTerm.trim(), limit);
  }

  /**
   * Obtener productos de un laboratorio
   */
  static async getByLaboratorio(laboratorioId: number): Promise<any[]> {
    // Verificar que el laboratorio existe
    const exists = await LaboratorioModel.exists(laboratorioId);
    if (!exists) {
      throw new NotFoundError('Laboratorio no encontrado');
    }

    return await ProductoModel.getByLaboratorio(laboratorioId);
  }

  /**
   * Obtener productos mejor calificados
   */
  static async getTopRated(limit: number = 10): Promise<any[]> {
    if (limit < 1 || limit > 50) {
      limit = 10;
    }

    return await ProductoModel.getTopRated(limit);
  }

  /**
   * Agregar imagen a un producto
   */
  static async addImage(
    productoId: number,
    imagenUrl: string,
    tipo: 'principal' | 'secundaria' = 'secundaria',
    orden?: string
  ): Promise<{ id: number; message: string }> {
    // Verificar que el producto existe
    const exists = await ProductoModel.exists(productoId);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Validar URL
    if (!isNotEmpty(imagenUrl)) {
      throw new BadRequestError('La URL de la imagen es requerida');
    }

    // Si es imagen principal, verificar que no haya otra
    if (tipo === 'principal') {
      const imagenes = await ProductoModel.getImages(productoId);
      const tienePrincipal = imagenes.some((img) => img.tipo === 'principal');

      if (tienePrincipal) {
        throw new BadRequestError('El producto ya tiene una imagen principal. Elimínala antes de agregar una nueva.');
      }
    }

    const imagenId = await ProductoModel.addImage(productoId, imagenUrl, tipo, orden);

    return {
      id: imagenId,
      message: 'Imagen agregada exitosamente',
    };
  }

  /**
   * Obtener imágenes de un producto
   */
  static async getImages(productoId: number): Promise<any[]> {
    const exists = await ProductoModel.exists(productoId);
    if (!exists) {
      throw new NotFoundError('Producto no encontrado');
    }

    return await ProductoModel.getImages(productoId);
  }

  /**
   * Obtener estadísticas generales de productos
   */
  static async getGeneralStats(): Promise<{
    total_productos: number;
    productos_con_resenas: number;
    promedio_calificacion_global: number;
  }> {
    const totalProductos = await ProductoModel.count();
    const topRated = await ProductoModel.getTopRated(1000); // Obtener muchos para calcular

    const productosConResenas = topRated.filter(
      (p) => p.cantidad_resenas > 0
    ).length;

    const sumaCalificaciones = topRated
      .filter((p) => p.cantidad_resenas > 0)
      .reduce((sum, p) => sum + parseFloat(p.promedio_calificacion), 0);

    const promedioGlobal =
      productosConResenas > 0
        ? Math.round((sumaCalificaciones / productosConResenas) * 10) / 10
        : 0;

    return {
      total_productos: totalProductos,
      productos_con_resenas: productosConResenas,
      promedio_calificacion_global: promedioGlobal,
    };
  }
}