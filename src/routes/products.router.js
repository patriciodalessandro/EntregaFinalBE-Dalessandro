import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

// GET /api/products
router.get('/', async (req, res) => {
  const productos = await manager.getProducts();
  res.json(productos);
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const producto = await manager.getProductById(id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const nuevo = await manager.addProduct(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    const actualizado = await manager.updateProduct(id, req.body);
    res.json(actualizado);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    await manager.deleteProduct(id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

export default router;
