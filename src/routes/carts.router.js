import { Router } from 'express';
import CartModel from '../models/CartModel.js';
import ProductModel from '../models/ProductModel.js';
import CartManager from '../managers/CartManager.js';


const router = Router();

// Crear un nuevo carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID (con productos populados)
router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un producto al carrito o incrementar su cantidad
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const itemIndex = cart.products.findIndex(p => p.product.equals(product._id));
    if (itemIndex >= 0) {
      cart.products[itemIndex].quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => !p.product.equals(req.params.pid));
    await cart.save();

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reemplazar todo el contenido del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body; // array de { product, quantity }
    const cart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    );
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.equals(req.params.pid));
    if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vaciar un carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
