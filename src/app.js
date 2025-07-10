import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;
const manager = new ProductManager('./src/data/products.json'); // ruta actualizada

// Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public')); // si luego agregás CSS o JS

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Websockets
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  manager.getProducts().then(products => {
    socket.emit('productos', products);
  });

  socket.on('nuevoProducto', async (productData) => {
    try {
      await manager.addProduct(productData);
      const productos = await manager.getProducts();
      io.emit('productos', productos);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('eliminarProducto', async (id) => {
    try {
      await manager.deleteProduct(id);
      const productos = await manager.getProducts();
      io.emit('productos', productos);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});
