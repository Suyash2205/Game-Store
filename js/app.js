/**
 * Game Store - Cart & Navigation
 * Uses localStorage for cart persistence across pages
 */

const CART_KEY = 'gameStore_cart';

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id && i.type === item.type);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(id, type) {
  const cart = getCart().filter((i) => !(i.id === id && i.type === type));
  saveCart(cart);
  return cart;
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + (i.quantity || 1), 0);
}

function updateCartCount() {
  const els = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  els.forEach((el) => {
    el.textContent = count;
    el.style.visibility = count ? 'visible' : 'hidden';
  });
}

function setActiveNav() {
  const path = window.location.pathname.replace(/^\//, '') || 'index.html';
  const file = path.endsWith('/') ? 'index.html' : path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const linkFile = href.split('/').pop() || 'index.html';
    a.classList.toggle('active', linkFile === file || (file === '' && linkFile === 'index.html'));
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setActiveNav();
});

// Export for use in checkout etc.
window.GameStore = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  getCartCount,
  updateCartCount,
};
