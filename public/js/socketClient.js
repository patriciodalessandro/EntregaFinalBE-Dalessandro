const socket = io();

// Escuchar lista productos actualizada y actualizar HTML
socket.on('productos', productos => {
  const container = document.getElementById('realTimeProducts');
  if (!container) return;

  container.innerHTML = '';

  productos.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.style.border = '1px solid #ccc';
    div.style.padding = '10px';
    div.style.width = '250px';
    div.style.marginBottom = '10px';

    div.innerHTML = `
      <h3>${product.title}</h3>
      <p><strong>Descripción:</strong> ${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <a href="/product/${product._id}">Ver producto</a>
      <button class="delete-btn" data-id="${product._id}">Eliminar</button>
    `;

    container.appendChild(div);
  });
});

// Event Delegation para botones eliminar
document.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    socket.emit('eliminarProducto', id);
  }
});

// Enviar nuevo producto a servidor
const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const product = {};

    formData.forEach((value, key) => {
      product[key] = value;
    });

    socket.emit('new-product', product);

    form.reset();
  });
}
