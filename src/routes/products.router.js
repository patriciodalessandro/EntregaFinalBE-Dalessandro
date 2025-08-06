import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET / --> Listado paginado de productos (ya lo tenías)
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /:pid --> Si viene desde un navegador, renderizo una vista, si es API devuelvo JSON
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Si acepta HTML (viene desde el navegador), renderizo la vista
    if (req.accepts('html')) {
      return res.render('productDetail', { product });
    }

    // Si no, respondo con JSON (por si se llama desde Postman)
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST / --> Crear producto (API)
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// DELETE /:pid --> Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

export default router;
