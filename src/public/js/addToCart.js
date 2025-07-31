document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.pid;
      const cartId = btn.dataset.cid;

      try {
        const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
        });

        if (res.ok) {
          alert('Producto agregado al carrito');
        } else {
          alert('Error al agregar el producto');
        }
      } catch (err) {
        console.error(err);
        alert('Error al agregar el producto');
      }
    });
  });
});
