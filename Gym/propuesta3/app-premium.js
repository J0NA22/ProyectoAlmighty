// app-premium.js — Propuesta 3: Premium / Boutique
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.pillar, .t-card, .mem-card, .process-step, .timeline-item, .metric-card'
  ).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s`;
    observer.observe(el);
  });
});
