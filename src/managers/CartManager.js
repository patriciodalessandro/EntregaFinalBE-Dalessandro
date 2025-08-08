import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/product.model.js';

export default class CartManager {
  async createCart() {
    try {
      return await cartModel.create({ products: [] });
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      return await cartModel.findById(id).populate('products.product');
    } catch (error) {
      throw new Error(`Error obteniendo carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      const product = await productModel.findById(productId);
      if (!product) throw new Error('Producto no encontrado');

      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error agregando producto: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      return await cart.save();
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error(`Error vaciando carrito: ${error.message}`);
    }
  }
}
