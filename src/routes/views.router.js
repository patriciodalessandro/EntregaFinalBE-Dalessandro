import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

const CART_ID = "689a01cb2e53ecfeea0d959d"; // o usa cookie / localstorage

// Ruta Home
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const productsData = await productManager.getProducts({ limit, page, sort, query });

    res.render("home", {
      products: productsData.docs,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      currentPage: productsData.page,
      totalPages: productsData.totalPages,
      cartId: CART_ID
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta detalle producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("product", { product, cartId: CART_ID });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta vista carrito (IMPORTANTE: singular "cart")
router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    // Asegurarse que cart.products es al menos un arreglo vacío
    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }

    res.render("cart", { cart, cartId: cid });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
