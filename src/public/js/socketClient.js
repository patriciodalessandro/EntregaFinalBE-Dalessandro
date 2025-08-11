const socket = io();

const lista = document.getElementById("lista-productos");
if (lista) {
  socket.on("productos", (productos) => {
    lista.innerHTML = "";
    productos.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.title} - $${p.price}`;
      lista.appendChild(li);
    });
  });
}

const formProducto = document.getElementById("form-producto");
if (formProducto) {
  formProducto.addEventListener("submit", (e) => {
    e.preventDefault();
    const producto = {
      title: document.getElementById("titulo").value,
      price: document.getElementById("precio").value
    };
    socket.emit("new-product", producto);
  });
}
