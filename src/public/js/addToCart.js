document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const viewCartButton = document.getElementById('view-cart');
  const cartCountElem = document.getElementById('cart-count');

  let cartId = localStorage.getItem('cartId');
  let currentCount = 0;

  async function createCartIfNotExists() {
    if (!cartId) {
      const res = await fetch('/api/carts', { method: 'POST' });
      const data = await res.json();
      cartId = data._id;
      localStorage.setItem('cartId', cartId);
    }
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      await createCartIfNotExists();
      const productId = button.getAttribute('data-id');

      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST'
      });

      if (res.ok) {
        alert('Producto agregado al carrito');
        currentCount++;
        if (cartCountElem) {
          cartCountElem.textContent = currentCount;
        }
      } else {
        alert('Error al agregar producto');
      }
    });
  });

  if (viewCartButton) {
    viewCartButton.addEventListener('click', () => {
      if (cartId) {
        window.location.href = `/cart/${cartId}`;
      } else {
        alert('El carrito está vacío.');
      }
    });
  }
});
