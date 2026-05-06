/**
 * Worldsno1bestghee - Theme JavaScript
 * Handles interactivity and dynamic components
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initAnimatedCounters();
  initFAQAccordion();
  initMobileMenu();
  initAJAXCart();
  initSmoothScroll();
  initMarquee();
  initAOS();
});

/* --- STICKY HEADER --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  });
}

/* --- ANIMATED COUNTERS --- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-item .number');
  if (counters.length === 0) return;

  const options = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'));
        let count = 0;
        const duration = 2000;
        const increment = countTo / (duration / 16);

        const updateCount = () => {
          count += increment;
          if (count < countTo) {
            target.innerText = Math.floor(count);
            requestAnimationFrame(updateCount);
          } else {
            target.innerText = countTo;
          }
        };

        updateCount();
        observer.unobserve(target);
      }
    });
  }, options);

  counters.forEach(counter => observer.observe(counter));
}

/* --- FAQ ACCORDION --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- MOBILE MENU --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu-drawer');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

/* --- AJAX CART --- */
function initAJAXCart() {
  const forms = document.querySelectorAll('form[action="/cart/add"]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.drawer-overlay');
  const cartClose = document.querySelector('.cart-drawer-close');

  if (forms.length === 0) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const cart = await response.json();
          updateCartDrawerContent();
          openCartDrawer();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    });
  });

  const openCartDrawer = () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCartDrawer = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
}

async function updateCartDrawerContent() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const content = document.querySelector('.drawer-content');
    
    if (cart.item_count === 0) {
      content.innerHTML = '<p class="text-center">Your cart is empty.</p>';
      return;
    }

    let itemsHtml = '';
    cart.items.forEach(item => {
      itemsHtml += `
        <div class="cart-item" style="display: flex; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
          <div class="item-details">
            <h4 style="font-size: 14px; margin-bottom: 5px;">${item.product_title}</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${item.variant_title || ''}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>${item.quantity} x ${Shopify.formatMoney(item.price)}</span>
            </div>
          </div>
        </div>
      `;
    });

    content.innerHTML = itemsHtml;
    
    // Update count in header
    const countBadge = document.querySelector('.cart-count');
    if (countBadge) countBadge.innerText = cart.item_count;

    // Update subtotal
    const subtotal = document.querySelector('.drawer-subtotal-value');
    if (subtotal) subtotal.innerText = Shopify.formatMoney(cart.total_price);

  } catch (error) {
    console.error('Error updating cart content:', error);
  }
}

/* --- SMOOTH SCROLL --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- MARQUEE --- */
function initMarquee() {
  // Purely CSS based animation for marquee is efficient.
  // This JS ensures the marquee content is duplicated for seamless looping if needed.
  const marquee = document.querySelector('.marquee-content');
  if (marquee) {
    const clone = marquee.cloneNode(true);
    marquee.parentNode.appendChild(clone);
  }
}

/* --- AOS (Animate on Scroll) --- */
function initAOS() {
  const animateElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => observer.observe(el));
}

// Shopify Money Formatter Helper
if (typeof Shopify === 'undefined') {
  var Shopify = {};
}
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || '₹{{amount}}';

  function defaultOption(opt, def) {
    return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
