document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.getAttribute('data-pid');
      const cid = btn.getAttribute('data-cid');

      try {
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
          method: 'POST'
        });

        if (response.ok) {
          alert('Producto agregado al carrito');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error || 'al agregar el producto'}`);
        }
      } catch (error) {
        alert('Error de conexión');
      }
    });
  });
});
