import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';
import ProductModel from '../models/ProductModel.js';  // Necesitamos esto para paginar desde Mongo

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const products = await ProductModel.paginate({}, { page, limit: 10, lean: true });

    let cart = await cartManager.createCart();

    res.render('home', { products, cid: cart._id });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');

    let cart = await cartManager.createCart();

    res.render('productDetail', { product, cid: cart._id });
  } catch (error) {
    res.status(500).send('Error al cargar el producto');
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartByIdPopulated(req.params.cid);
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
});

export default router;

