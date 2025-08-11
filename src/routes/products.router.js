import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta Home con lista de productos
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Usamos cookie para carrito, sino creamos uno
    let cartId = req.cookies?.cartId;
    if (!cartId) {
      const cart = await cartManager.createCart();
      cartId = cart._id.toString();
      res.cookie("cartId", cartId, { httpOnly: true });
    }

    const productsData = await productManager.getProducts({ limit, page, sort, query });

    res.render("home", {
      products: productsData.docs,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      currentPage: productsData.page,
      totalPages: productsData.totalPages,
      cartId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    let cartId = req.cookies?.cartId;
    if (!cartId) {
      const cart = await cartManager.createCart();
      cartId = cart._id.toString();
      res.cookie("cartId", cartId, { httpOnly: true });
    }

    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("product", { product, cartId });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API JSON
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    req.io.emit("productos", await productManager.getProducts({}));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    req.io.emit("productos", await productManager.getProducts({}));
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
