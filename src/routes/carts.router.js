import { Router } from "express";
import CartManager from "../managers/CartManager.js"

const router = Router();
const cartManager = new CartManager();

// Crear carrito - POST /api/carts
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ _id: newCart._id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// Obtener carrito por ID con productos poblados - GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    // Usamos lean=true para solo lectura (objeto plano)
    const cart = await cartManager.getCartById(cid, true);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito - POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto del carrito - DELETE /api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    // lean=false para que cart sea documento mongoose (tenga save)
    const cart = await cartManager.getCartById(cid, false);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product._id.toString() === pid
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vaciar carrito - DELETE /api/carts/:cid
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid, false);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    cart.products = [];
    await cart.save();
    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar todo el carrito con arreglo de productos - PUT /api/carts/:cid
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "products debe ser un arreglo" });
    }

    const cart = await cartManager.getCartById(cid, false);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = products.map((p) => ({
      product: p.product,
      quantity: p.quantity,
    }));

    await cart.save();

    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto en carrito - PUT /api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "quantity debe ser un número mayor a 0" });
    }

    const cart = await cartManager.getCartById(cid, false);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product._id.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    res.json({ message: "Cantidad actualizada", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
