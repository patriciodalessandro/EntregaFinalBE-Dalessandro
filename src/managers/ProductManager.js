import fs from 'fs/promises';
const path = './src/data/products.json';

class ProductManager {
  constructor() {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async addProduct(product) {
    const productos = await this.getProducts();
    if (productos.some(p => p.code === product.code)) {
      throw new Error('Código duplicado');
    }

    const newProduct = {
      id: productos.length ? productos[productos.length - 1].id + 1 : 1,
      status: true,
      ...product,
    };

    productos.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    return newProduct;
  }

  // Otros métodos como getProductById, updateProduct, deleteProduct...
}

export default ProductManager;
