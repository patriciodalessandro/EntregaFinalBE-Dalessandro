import productModel from "../models/ProductModel.js";

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    if (query) {
      // Si query es "true" o "false" se busca por status, sino por category
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : {};

    const options = {
      limit,
      page,
      sort: sortOptions,
      lean: true,
    };

    return await productModel.paginate(filter, options);
  }

  async getProductById(id) {
    return await productModel.findById(id).lean();
  }

  async addProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(id, updatedFields) {
    return await productModel.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  async deleteProduct(id) {
    return await productModel.findByIdAndDelete(id);
  }
}
