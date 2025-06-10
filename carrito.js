function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function animateCartIcon() {
  const icon = document.getElementById('cartIcon');
  if (icon) {
    icon.classList.add('cart-bounce');
    setTimeout(() => icon.classList.remove('cart-bounce'), 400);
  }
}
function updateCartCount() {
  const cart = getCart();
  const el = document.getElementById('cartCount');
  if (el) {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    el.textContent = count;
    el.style.background = count > 0 ? '#d6336c' : '#ccc';
    el.style.transition = 'background 0.2s';
  }
}
function updateCartModal() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; color:#888;">El carrito está vacío.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, idx) => `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; gap:10px;">
        <img src="${item.img || ''}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
        <span style="flex:1;">${item.name}<br>
          <small>$${item.price.toFixed(2)} c/u</small>
        </span>
        <div style="display:flex; align-items:center; gap:4px;">
          <button onclick="window.changeQty(${idx}, -1)" style="background:#eee; border:none; border-radius:3px; width:24px; height:24px; font-size:1em; cursor:pointer;">-</button>
          <span style="min-width:20px; text-align:center;">${item.qty}</span>
          <button onclick="window.changeQty(${idx}, 1)" style="background:#eee; border:none; border-radius:3px; width:24px; height:24px; font-size:1em; cursor:pointer;">+</button>
        </div>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
        <button onclick="window.removeFromCart(${idx})" style="background:none; border:none; color:#d6336c; font-size:1.2em; cursor:pointer;" title="Eliminar">&#128465;</button>
      </div>
    `).join('');
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const elTotal = document.getElementById('cartTotal');
  if (elTotal) elTotal.textContent = `$${total.toFixed(2)}`;
}
function removeFromCart(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  setCart(cart);
  updateCartCount();
  updateCartModal();
}
function clearCart() {
  setCart([]);
  updateCartCount();
  updateCartModal();
}
window.changeQty = function(idx, delta) {
  let cart = getCart();
  if (!cart[idx]) return;
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart[idx].qty = 1;
  setCart(cart);
  updateCartCount();
  updateCartModal();
  animateCartIcon();
};
// Mostrar/ocultar modal
const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  cartIcon.onclick = function() {
    updateCartModal();
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.remove('cart-shake');
      void modal.offsetWidth; // trigger reflow
      modal.classList.add('cart-shake');
    }
    animateCartIcon();
  };
}
const closeCart = document.getElementById('closeCart');
if (closeCart) {
  closeCart.onclick = function() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
  };
}
const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) clearCartBtn.onclick = clearCart;
const checkoutCartBtn = document.getElementById('checkoutCart');
function checkoutCart() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  localStorage.setItem('cartTotal', total.toFixed(2));
  window.location.href = 'pago.html';
}
if (checkoutCartBtn) checkoutCartBtn.onclick = checkoutCart;
updateCartCount();
window.addToCart = function(product) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.name === product.name && item.price === product.price);
  if (idx > -1) {
    cart[idx].qty += product.qty;
  } else {
    cart.push(product);
  }
  setCart(cart);
  updateCartCount();
  animateCartIcon();
};
window.removeFromCart = removeFromCart;
window.checkoutCart = checkoutCart;
window.goToCheckout = function() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  localStorage.setItem('cartTotal', total.toFixed(2));
  window.location.href = 'pago.html';
};
window.clearCart = clearCart;
window.updateCartCount = updateCartCount; 

document.addEventListener('DOMContentLoaded', function() {
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.onclick = function() {
      updateCartModal();
      const modal = document.getElementById('cartModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('cart-shake');
        void modal.offsetWidth;
        modal.classList.add('cart-shake');
      }
      animateCartIcon();
    };
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const clearCartBtn = document.getElementById('clearCart');
  if (clearCartBtn) clearCartBtn.onclick = clearCart;

  const checkoutCartBtn = document.getElementById('checkoutCart');
  if (checkoutCartBtn) checkoutCartBtn.onclick = checkoutCart;
});
document.addEventListener('DOMContentLoaded', function() {
  const closeCart = document.getElementById('closeCart');
  if (closeCart) {
    closeCart.onclick = function() {
      const modal = document.getElementById('cartModal');
      if (modal) modal.style.display = 'none';
    };
  }
});