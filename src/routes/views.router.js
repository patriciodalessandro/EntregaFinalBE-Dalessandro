import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', async (req, res) => {
  const productos = await manager.getProducts();
  res.render('home', { productos });
});

router.get('/realtimeproducts', async (req, res) => {
  const productos = await manager.getProducts();
  res.render('realTimeProducts', { productos });
});

export default router;
