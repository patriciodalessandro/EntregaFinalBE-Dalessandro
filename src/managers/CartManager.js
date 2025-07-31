import CartModel from '../models/CartModel.js';

class CartManager {
  // Crear un carrito vacío
  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  // Obtener carrito por id con productos "populated"
  async getCartByIdPopulated(cid) {
    const cart = await CartModel.findById(cid).populate('products.product');
    return cart;
  }

  // Agregar producto al carrito o aumentar cantidad
  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  // Eliminar producto del carrito
  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
  }

  // Reemplazar todos los productos del carrito
  async updateCartProducts(cid, products) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = products;
    await cart.save();
    return cart;
  }

  // Actualizar la cantidad de un producto específico
  async updateProductQuantity(cid, pid, quantity) {
    if (quantity <= 0) throw new Error('Cantidad debe ser mayor a 0');

    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) throw new Error('Producto no encontrado en el carrito');

    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  }

  // Vaciar carrito (eliminar todos los productos)
  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
  }
}

export default CartManager;
