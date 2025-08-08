import { productModel } from '../models/product.model.js';

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      const filter = query ? { category: query } : {};
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
      };

      return await productModel.paginate(filter, options);
    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      return await productModel.findById(id);
    } catch (error) {
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }
  }

  async addProduct(productData) {
    try {
      return await productModel.create(productData);
    } catch (error) {
      throw new Error(`Error agregando producto: ${error.message}`);
    }
  }

  async updateProduct(id, updatedData) {
    try {
      return await productModel.findByIdAndUpdate(id, updatedData, { new: true });
    } catch (error) {
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await productModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }
}
