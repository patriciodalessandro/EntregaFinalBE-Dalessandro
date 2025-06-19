import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts/
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el carrito' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
