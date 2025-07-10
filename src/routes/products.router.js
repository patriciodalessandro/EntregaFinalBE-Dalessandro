import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

// GET all products
router.get('/', async (req, res) => {
  const productos = await manager.getProducts();
  res.json(productos);
});

// POST add new product
router.post('/', async (req, res) => {
  try {
    const product = req.body;
    const nuevo = await manager.addProduct(product);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET product by ID
router.get('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const producto = await manager.getProductById(id);

  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// PUT update product
router.put('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const updates = req.body;

  if ('id' in updates) {
    return res.status(400).json({ error: 'No se puede modificar el ID' });
  }

  const actualizado = await manager.updateProduct(id, updates);

  if (actualizado) {
    res.json(actualizado);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// DELETE product
router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const eliminado = await manager.deleteProduct(id);

  if (eliminado) {
    res.json({ message: 'Producto eliminado correctamente' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default router;
