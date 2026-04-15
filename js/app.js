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

function getProductCards() {
  return Array.from(document.querySelectorAll('.card')).filter((card) => card.querySelector('.card-title'));
}

function clearSearchState(cards) {
  cards.forEach((card) => {
    card.classList.remove('search-match', 'search-hidden');
  });
  const message = document.querySelector('[data-search-message]');
  if (message) {
    message.remove();
  }
}

function renderSearchResults(query) {
  const cards = getProductCards();
  if (!cards.length) {
    return { handled: false, matches: 0 };
  }

  const normalizedQuery = query.trim().toLowerCase();
  const cardGrid = document.querySelector('.card-grid');
  if (!normalizedQuery) {
    clearSearchState(cards);
    return { handled: true, matches: cards.length };
  }

  let matches = 0;
  cards.forEach((card) => {
    const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
    const meta = (card.querySelector('.card-meta')?.textContent || '').toLowerCase();
    const isMatch = title.includes(normalizedQuery) || meta.includes(normalizedQuery);
    card.classList.toggle('search-hidden', !isMatch);
    card.classList.toggle('search-match', isMatch);
    if (isMatch) {
      matches += 1;
    }
  });

  if (cardGrid) {
    let message = document.querySelector('[data-search-message]');
    if (!message) {
      message = document.createElement('p');
      message.className = 'search-message';
      message.setAttribute('data-search-message', 'true');
      cardGrid.parentNode?.insertBefore(message, cardGrid);
    }
    if (matches) {
      message.textContent = `Showing ${matches} result(s) for "${query}"`;
    } else {
      message.textContent = `No products found for "${query}".`;
    }
  }

  return { handled: true, matches };
}

function applySearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('search') || '').trim();
  if (!query) {
    return;
  }

  const searchInput = document.querySelector('.site-search-input');
  if (searchInput) {
    searchInput.value = query;
  }
  renderSearchResults(query);
}

function setupSiteSearch() {
  const forms = document.querySelectorAll('[data-site-search]');
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('.site-search-input');
      const query = (input?.value || '').trim();
      if (!query) {
        return;
      }

      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      const result = renderSearchResults(query);
      if (result.handled && result.matches) {
        const firstMatch = document.querySelector('.card.search-match');
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const params = new URLSearchParams(window.location.search);
        params.set('search', query);
        const next = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', next);
        return;
      }

      if (currentFile !== 'games.html') {
        window.location.href = `games.html?search=${encodeURIComponent(query)}`;
      }
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setActiveNav();
  setupSiteSearch();
  applySearchFromUrl();
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
