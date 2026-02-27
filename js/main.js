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
  initWhatsAppFloat();
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

  // Mobile & Desktop: tap/click on dropdown parent toggles submenu
  navLinks.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      // On mobile, always toggle
      // On desktop, toggle on click to support trackpad/touch laptops
      const item = link.closest('.has-dropdown');
      const wasOpen = item.classList.contains('open');

      // If the parent link href is '#' or same page, prevent navigation
      if (window.innerWidth <= 768) {
        e.preventDefault();
      } else {
        // On desktop, toggle dropdown and prevent navigation to parent link
        e.preventDefault();
      }

      // Close all other dropdowns
      navLinks.querySelectorAll('.has-dropdown').forEach(d => {
        if (d !== item) d.classList.remove('open');
      });
      // Toggle this one
      if (!wasOpen) {
        item.classList.add('open');
      } else {
        item.classList.remove('open');
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
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Validate first — if invalid, block everything
  if (!data.name || !data.email || !data.phone) {
    event.preventDefault();
    showNotification('Please fill in your name, email and phone number.', 'error');
    return;
  }

  // Build WhatsApp message and open in new tab
  const lines = [
    '🏪 *New Franchise Enquiry – MakeMyFranchise*',
    '',
    `👤 *Name:* ${data.name}`,
    `📱 *Mobile:* ${data.phone}`,
    `📧 *Email:* ${data.email}`,
    data.city       ? `🏙️ *City:* ${data.city}`           : '',
    data.investment ? `💰 *Budget:* ${data.investment}`    : '',
    data.sector     ? `🏭 *Sector:* ${data.sector}`        : '',
    data.type       ? `👥 *Role:* ${data.type}`            : '',
    data.message    ? `💬 *Message:* ${data.message}`      : '',
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/919168516666?text=${encodeURIComponent(lines)}`, '_blank');

  // Let the form submit naturally to FormSubmit.co (sends email to info@makemyfranchise.in)
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

  const lines = [
    '🏪 *Quick Franchise Enquiry – MakeMyFranchise*',
    '',
    `👤 *Name:* ${data.name}`,
    `📱 *Mobile:* ${data.mobile}`,
    data.budget ? `💰 *Budget:* ${data.budget}` : '',
    data.sector ? `🏭 *Sector:* ${data.sector}` : '',
  ].filter(Boolean).join('\n');

  const waUrl = `https://wa.me/919168516666?text=${encodeURIComponent(lines)}`;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Opening WhatsApp…';
  submitBtn.disabled = true;

  window.open(waUrl, '_blank');

  setTimeout(() => {
    showNotification('WhatsApp opened! Your enquiry is pre-filled — just tap Send.', 'success');
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 800);
}

/* ---------- WhatsApp Float Button ---------- */
function initWhatsAppFloat() {
  const btn = document.createElement('a');
  btn.href = 'https://wa.me/919168516666?text=' + encodeURIComponent('Hi! I am interested in franchise opportunities with MakeMyFranchise. Please guide me.');
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.className = 'wa-float';
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(btn);
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
