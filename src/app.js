import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configuración para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config();

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, '..', 'public')));

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado por websocket');

  socket.on('new-product', async (product) => {
    try {
      await productManager.addProduct(product);
      const productos = await productManager.getProducts({});
      io.emit('productos', productos);
    } catch (error) {
      console.error('Error agregando producto:', error.message);
    }
  });

  socket.on('delete-product', async (id) => {
    try {
      await productManager.deleteProduct(id);
      const productos = await productManager.getProducts({});
      io.emit('productos', productos);
    } catch (error) {
      console.error('Error eliminando producto:', error.message);
    }
  });
});

const PORT = 8080;

// Levantar servidor solo si conecta bien a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado con éxito');
    httpServer.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar MongoDB:', err);
    process.exit(1); // Detener app si falla conexión DB
  });
