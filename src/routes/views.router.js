import { Router } from 'express'
import CartModel from '../models/CartModel.js'
import ProductModel from '../models/ProductModel.js'

const router = Router()

// Ruta principal: listado de productos con paginación
router.get('/', async (req, res) => {
  try {
    let cartId = req.session?.cartId

    if (!cartId) {
      const newCart = await CartModel.create({ products: [] })
      cartId = newCart._id.toString()
      req.session.cartId = cartId
    }

    const { page = 1, limit = 10, sort } = req.query
    const options = {
      page,
      limit,
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    }

    const products = await ProductModel.paginate({}, options)

    res.render('home', {
      products,
      cid: cartId,
    })
  } catch (error) {
    console.error('Error al renderizar home:', error)
    res.status(500).send('Error interno')
  }
})

// Ruta carrito por id
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product')
    if (!cart) return res.status(404).send('Carrito no encontrado')

    res.render('cart', { cart })
  } catch (error) {
    console.error('Error al cargar el carrito:', error)
    res.status(500).send('Error al cargar el carrito')
  }
})

// Ruta detalle producto individual
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid)
    if (!product) return res.status(404).send('Producto no encontrado')

    res.render('product', { product })
  } catch (error) {
    console.error('Error al mostrar producto individual:', error)
    res.status(500).send('Error interno')
  }
})

// Ruta vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  try {
    const productos = await ProductModel.find({})
    res.render('realTimeProducts', { productos })
  } catch (error) {
    console.error('Error al cargar productos en tiempo real:', error)
    res.status(500).send('Error interno')
  }
})

export default router
