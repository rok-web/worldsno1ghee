/**
 * Worldsno1bestghee Theme JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCartDrawer();
  initVariantSelectors();
  initAnimations();
});

// Sticky Header
function initStickyHeader() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }
}

// AJAX Cart
async function addToCart(variantId, quantity = 1) {
  const formData = {
    'items': [{
      'id': variantId,
      'quantity': quantity
    }]
  };

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const cart = await response.json();
    openCartDrawer();
    updateCartCount();
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// Cart Drawer
function initCartDrawer() {
  const cartToggle = document.querySelector('.cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const closeCart = document.querySelector('.close-cart');

  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (closeCart) {
    closeCart.addEventListener('click', () => {
      closeCartDrawer();
    });
  }
}

function openCartDrawer() {
  document.querySelector('.cart-drawer').classList.add('is-open');
  document.body.classList.add('overflow-hidden');
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer').classList.remove('is-open');
  document.body.classList.remove('overflow-hidden');
}

// Variant Selectors
function initVariantSelectors() {
  const productForms = document.querySelectorAll('.product-form');
  
  productForms.forEach(form => {
    const selector = form.querySelector('.variant-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        const variantId = e.target.value;
        // Update price display if needed
        const priceDisplay = form.querySelector('.product-price');
        // This would ideally fetch from product.json or have data attributes
      });
    }
  });
}

// Animations on scroll
function initAnimations() {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
