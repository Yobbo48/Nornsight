/* ============================================================
   L'Énergie des Runes v2 — JS principal
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     Header : effet scroll
     ---------------------------------------------------------- */
  const header = document.getElementById('site-header');
  if (header) {
    const tick = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ----------------------------------------------------------
     Menu burger mobile
     ---------------------------------------------------------- */
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');
  if (burger && drawer) {
    const toggle = (force) => {
      const open = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ----------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback : tout afficher si pas de support
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     Newsletter
     ---------------------------------------------------------- */
  const form = document.getElementById('newsletter-form');
  const msg  = document.getElementById('newsletter-msg');
  if (form && msg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email')?.value?.trim();
      if (!email) return;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      try {
        const data = new FormData();
        data.append('action', 'edr_newsletter');
        data.append('email', email);
        data.append('nonce', window.edr?.nonce || '');

        const res  = await fetch(window.edr?.ajax || '/wp-admin/admin-ajax.php', { method: 'POST', body: data });
        const json = await res.json();

        msg.style.display = 'block';
        msg.style.color   = json.success ? '' : '#d9534f';
        msg.textContent   = json.data?.message || (json.success ? 'Merci !' : 'Une erreur est survenue.');
        if (json.success) { form.reset(); }
      } catch {
        msg.style.display = 'block';
        msg.style.color   = '#d9534f';
        msg.textContent   = 'Une erreur est survenue, réessayez.';
      } finally {
        btn.textContent = originalText;
        btn.disabled    = false;
      }
    });
  }

  /* ----------------------------------------------------------
     Liens ancres lisses
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ----------------------------------------------------------
     Active nav link
     ---------------------------------------------------------- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__menu a').forEach(a => {
    try {
      const url = new URL(a.href);
      if (url.pathname === currentPath || (url.pathname !== '/' && currentPath.startsWith(url.pathname))) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    } catch {}
  });

})();
