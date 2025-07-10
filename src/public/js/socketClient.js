const socket = io();

const form = document.getElementById('productForm');
const lista = document.getElementById('lista');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.price = parseFloat(data.price);
  data.stock = parseInt(data.stock);
  data.thumbnails = [data.thumbnails];
  socket.emit('new-product', data);
  form.reset();
});

lista.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar')) {
    const id = e.target.closest('li').dataset.id;
    socket.emit('delete-product', parseInt(id));
  }
});

socket.on('productos', (productos) => {
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.setAttribute('data-id', p.id);
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} <button class="eliminar">Eliminar</button>`;
    lista.appendChild(li);
  });
});
