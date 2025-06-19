import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  const productos = await manager.getProducts();
  res.json(productos);
});

router.post('/', async (req, res) => {
  try {
    const product = req.body;
    const nuevo = await manager.addProduct(product);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Agregás GET /:pid, PUT /:pid, DELETE /:pid

export default router;
