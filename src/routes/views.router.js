import { Router } from 'express'
import CartModel from '../data/models/cart.model.js'
import ProductModel from '../data/models/product.model.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    // Verifica si ya existe un carrito en sesión o crea uno nuevo
    let cartId = req.session.cartId

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

export default router
