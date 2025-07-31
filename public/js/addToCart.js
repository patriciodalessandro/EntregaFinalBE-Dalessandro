document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn')

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.pid
      const cartId = button.dataset.cid

      try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
        })

        if (response.ok) {
          alert('Producto agregado al carrito!')
        } else {
          alert('Error al agregar producto al carrito')
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error)
        alert('Error inesperado')
      }
    })
  })
})
