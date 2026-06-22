/* Golden Scissors — main.js */

(function () {
  'use strict';

  /* ── Sticky header shadow on scroll ───────────────────── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger menu ────────────────────────────────────── */
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });

  // Close menu when a link inside it is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
    });
  });

  /* ── Set date input min to today ──────────────────────── */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ── Booking form submission ───────────────────────────── */
  const form        = document.getElementById('booking-form');
  const successMsg  = document.getElementById('booking-success');
  const errorBanner = document.getElementById('form-error');
  const submitBtn   = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) valid = false;
      });

      if (!valid) {
        errorBanner.hidden = false;
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      errorBanner.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.hidden = true;
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Server error');
        }
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Appointment →';
        errorBanner.hidden = false;
        errorBanner.textContent =
          'Something went wrong — please call us on +44 7757 225925 to book.';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Hide error banner when user starts correcting fields
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (!errorBanner.hidden) errorBanner.hidden = true;
      });
    });
  }
})();
