import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

export default class CartManager {
  async createCart() {
    return await CartModel.create({ products: [] });
  }

  async getCartById(id) {
    return await CartModel.findById(id).populate("products.product").lean();
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const product = await ProductModel.findById(productId);
    if (!product) return null;

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cart.save();
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    return await cart.save();
  }
}
