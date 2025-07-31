const socket = io()

// Cuando se recibe un nuevo producto del servidor
socket.on('nuevoProducto', (producto) => {
  const container = document.getElementById('productContainer')

  const div = document.createElement('div')
  div.style.border = '1px solid #ccc'
  div.style.padding = '10px'
  div.style.width = '250px'
  div.innerHTML = `
    <h3>${producto.title}</h3>
    <p><strong>Descripción:</strong> ${producto.description}</p>
    <p><strong>Precio:</strong> $${producto.price}</p>
    <p><strong>Stock:</strong> ${producto.stock}</p>
    <button 
      class="add-to-cart-btn"
      data-pid="${producto._id}"
      data-cid="${producto.cid}"
    >
      Agregar al carrito
    </button>
    <br />
    <a href="/products/${producto._id}">Ver producto</a>
  `

  container.appendChild(div)
})

// Envío del nuevo producto al servidor
const form = document.getElementById('productForm')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const nuevoProducto = {}

    formData.forEach((value, key) => {
      nuevoProducto[key] = value
    })

    // Enviar por WebSocket
    socket.emit('crearProducto', nuevoProducto)

    form.reset()
  })
}
