/**
 * =====================================================
 * PROPUESTA 3: APP.JS - Estilo Urbano / Juvenil
 * =====================================================
 * 
 * Este archivo maneja:
 * 1. Navegación responsive y scroll effects
 * 2. Carga de reseñas (GET) desde Google Sheets
 * 3. Envío de nuevas reseñas (POST) a Google Sheets
 * 4. Animaciones de scroll reveal con Intersection Observer
 * 5. Sistema de estrellas interactivas
 * 6. Efecto parallax en hero
 */

import { cargarResenas, enviarResena, initStarRating } from '../assets/js/reviews.js';

// ========== NAVEGACIÓN ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== SCROLL REVEAL ==========
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .team-card, .gallery-item, .promo-card, .location-info, .location-map, .review-form-wrapper').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ========== PARALLAX SUTIL EN HERO ==========
const neonCircle = document.querySelector('.neon-circle');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 800 && neonCircle) {
        neonCircle.style.transform = `translate(${scrollY * 0.05}px, ${scrollY * 0.08}px)`;
    }
});

// ========== SISTEMA DE RESEÑAS ==========

/**
 * FETCH GET - Cargar reseñas al iniciar la página:
 * Manda un GET al endpoint de Google Sheets.
 * Recibe un JSON con todas las reseñas almacenadas.
 * Cada reseña tiene: nombre, comentario, calificacion.
 * Se renderizan como tarjetas con la calificación en
 * estrellas visuales (★★★★☆).
 */
cargarResenas('reviewsContainer', 'urban');

/**
 * Sistema de estrellas interactivas.
 * Click en una estrella actualiza el input hidden.
 */
initStarRating('starRating');

/**
 * FETCH POST - Enviar nueva reseña:
 * Se ejecuta al hacer submit del formulario.
 * Recoge nombre, comentario y calificación.
 * Envía JSON al endpoint con fetch POST.
 * Google Sheets lo almacena automáticamente.
 * Después de 2 segundos se recargan las reseñas.
 */
const reviewForm = document.getElementById('reviewForm');
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarResena('reviewForm', 'reviewsContainer', 'urban');
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ========== HOVER TILT EFECTO EN CARDS ==========
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

console.log('🔥 Almighty Barber Co. - Propuesta Urbana cargada correctamente');
