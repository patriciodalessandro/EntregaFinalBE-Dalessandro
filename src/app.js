import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import dotenv from "dotenv";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuramos Handlebars con helpers personalizados
const hbs = handlebars.create({
  helpers: {
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }
  }
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers con acceso a Socket.io
app.use("/api/products", (req, res, next) => {
  req.io = io;
  next();
}, productsRouter);

app.use("/api/carts", (req, res, next) => {
  req.io = io;
  next();
}, cartsRouter);

app.use("/", viewsRouter);

// Socket.io
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.emit("productos", await productManager.getProducts({}));

  socket.on("new-product", async (producto) => {
    await productManager.addProduct(producto);
    io.emit("productos", await productManager.getProducts({}));
  });

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("productos", await productManager.getProducts({}));
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
