import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('./src/data/carts.json');

// POST /api/carts → crea un carrito vacío
router.post('/', async (req, res) => {
  const nuevoCarrito = await manager.createCart();
  res.status(201).json(nuevoCarrito);
});

// GET /api/carts/:cid → productos del carrito
router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const carrito = await manager.getCartById(cid);
  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(carrito.products);
});

// POST /api/carts/:cid/product/:pid → agrega producto
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  try {
    const actualizado = await manager.addProductToCart(cid, pid);
    res.json(actualizado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
