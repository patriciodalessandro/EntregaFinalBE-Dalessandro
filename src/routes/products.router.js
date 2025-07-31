import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    // Recibir los query params limit, page, sort, query
    const { limit, page, sort, query } = req.query;
    
    // Llamar al método que devuelve paginación y filtros
    const result = await productManager.getProducts({ limit, page, sort, query });

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

export default router;
