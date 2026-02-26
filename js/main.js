/* ============================================
   MAKEMYFRANCHISE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initFaqAccordion();
});

/* ---------- Sticky Header ---------- */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Mobile: tap on dropdown parent toggles submenu
  navLinks.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const item = link.closest('.has-dropdown');
        const wasOpen = item.classList.contains('open');
        // Close all
        navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      }
    });
  });

  // Close menu when a non-parent link is clicked
  navLinks.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown') && window.innerWidth > 768) {
      navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    }
    if (!e.target.closest('.navbar') && window.innerWidth <= 768) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

/* ---------- Scroll Animations (Intersection Observer) ---------- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .stagger-children'
  );

  animatedElements.forEach(el => observer.observe(el));
}

/* ---------- FAQ Accordion ---------- */
function initFaqAccordion() {
  // Initialize all FAQ items as closed
  document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.style.maxHeight = '0px';
  });
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isActive = item.classList.contains('active');

  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
    }
  });

  // Toggle current item
  if (isActive) {
    item.classList.remove('active');
    answer.style.maxHeight = '0px';
  } else {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

/* ---------- Contact Form Handler ---------- */
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Simple validation
  if (!data.name || !data.email || !data.phone) {
    showNotification('Please fill in your name, email and phone number.', 'error');
    return;
  }

  // Simulate form submission
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  setTimeout(() => {
    showNotification('Thank you! A franchise expert will reach out to you within 24 hours.', 'success');
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

/* ---------- Notification Toast ---------- */
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;margin-left:12px;">&times;</button>
  `;

  // Styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: '9999',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    animation: 'slideInRight 0.4s ease',
    fontWeight: '500',
    fontSize: '0.95rem',
    background: type === 'success' ? '#10b981' : '#ef4444',
    color: '#ffffff'
  });

  document.body.appendChild(notification);

  // Auto remove
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/* ---------- Hero Enquiry Form ---------- */
function handleHeroEnquiry(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (!data.name || !data.mobile) {
    showNotification('Please enter your name and mobile number.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting…';
  submitBtn.disabled = true;

  setTimeout(() => {
    showNotification('Thank you! A franchise expert will call you within 24 hours.', 'success');
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1200);
}

// Add notification animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
