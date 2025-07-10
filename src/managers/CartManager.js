import fs from 'fs/promises';
const path = './src/data/carts.json';

class CartManager {
  constructor() {
    this.path = path;
  }

  async _getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this._getCarts();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await this._saveCarts(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    return cart || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this._getCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) throw new Error('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._saveCarts(carts);
    return cart;
  }
}

export default CartManager;
