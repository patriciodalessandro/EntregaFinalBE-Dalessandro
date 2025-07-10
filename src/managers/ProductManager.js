import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
  constructor(path = join(__dirname, '../data/products.json')) {
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

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async addProduct(product) {
    const products = await this.getProducts();

    if (products.some(p => p.code === product.code)) {
      throw new Error('Código duplicado');
    }

    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      status: true,
      ...product,
    };

    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    products.splice(index, 1);
    await this.saveProducts(products);
  }
}

export default ProductManager;
