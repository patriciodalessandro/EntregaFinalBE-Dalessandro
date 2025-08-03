import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts({});
  res.render('home', { products: products.payload });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// NUEVA RUTA ➜ Vista de producto individual
router.get('/product/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('product', { product });
  } catch (error) {
    console.error('Error obteniendo producto:', error.message);
    res.status(500).send('Error interno');
  }
});

export default router;
