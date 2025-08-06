import ProductModel from '../models/ProductModel.js';

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true
    };

    // Filtro por categoría o status (disponibilidad)
    let filter = {};
    if (query) {
      if (query === 'available') filter = { status: true };
      else filter = { category: query };
    }

    const result = await ProductModel.paginate(filter, options);

    // Construir links para paginación
    const baseLink = `/api/products?limit=${options.limit}`;
    const prevLink = result.hasPrevPage ? `${baseLink}&page=${result.prevPage}` : null;
    const nextLink = result.hasNextPage ? `${baseLink}&page=${result.nextPage}` : null;

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    };
  }

  async getProductById(id) {
    return await ProductModel.findById(id).lean();
  }

  async addProduct(data) {
    const exists = await ProductModel.findOne({ code: data.code });
    if (exists) throw new Error('Código duplicado');

    const productData = {
      ...data,
      thumbnails: [data.thumbnail], 
    };
    delete productData.thumbnail; 

    return await ProductModel.create(productData);
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) throw new Error('Producto no encontrado');
    return result;
  }
}

export default ProductManager;
