import { Router } from 'express';
import { productModel } from '../models/product.model.js';

const router = Router();

// Home con paginación y filtros
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const filter = query ? { category: query } : {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const products = await productModel.paginate(filter, options);

    res.render('home', {
      products: products.docs,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages
    });
  } catch (error) {
    res.status(500).send('Error cargando la vista');
  }
});

// Vista de producto individual
router.get('/product/:pid', async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('product', { product });
  } catch (error) {
    res.status(500).send('Error cargando el producto');
  }
});

// Vista de carrito
router.get('/cart/:cid', async (req, res) => {
  try {
    // Esto después se ajusta cuando adaptemos el cartModel
    res.render('cart', { cid: req.params.cid });
  } catch (error) {
    res.status(500).send('Error cargando el carrito');
  }
});

export default router;

