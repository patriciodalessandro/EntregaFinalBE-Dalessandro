import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

// ✅ Vista estática con productos actuales
router.get('/home', async (req, res) => {
  const productos = await manager.getProducts();
  res.render('home', { productos });
});

// ✅ Vista en tiempo real con WebSocket
router.get('/realtimeproducts', async (req, res) => {
  const productos = await manager.getProducts();
  res.render('realTimeProducts', { productos });
});

export default router;
