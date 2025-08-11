import { Router } from "express";
import CartManager from "../managers/cartManager.js";

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

// Eliminar producto del carrito - DELETE /api/carts/:cid/product/:pid
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar carrito - POST /api/carts/:cid/clear
router.post("/:cid/clear", async (req, res) => {
  try {
    const { cid } = req.params;
    const emptiedCart = await cartManager.clearCart(cid);
    if (!emptiedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json({ success: true, cart: emptiedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
