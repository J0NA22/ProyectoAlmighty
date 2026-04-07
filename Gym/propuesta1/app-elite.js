// app-elite.js — Propuesta 1: Hard Training / Élite
document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll shrink
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Scroll-reveal observer
  const revealEls = document.querySelectorAll(
    '.service-item, .testimonial-card, .plan-card, .stat-pill, .faq-item'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Counter animation for stats
  function animateCount(el, end, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      el.textContent = Math.floor(start).toLocaleString() + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nums = e.target.querySelectorAll('.num');
        nums.forEach(n => {
          const raw = n.textContent;
          if (raw.includes('K')) animateCount(n, 12, 'K+');
          else if (raw.includes('%')) animateCount(n, 98, '%');
        });
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);
});
