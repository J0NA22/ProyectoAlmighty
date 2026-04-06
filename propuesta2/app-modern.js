/**
 * =====================================================
 * PROPUESTA 2: APP.JS - Estilo Moderno / Minimalista
 * =====================================================
 * 
 * Este archivo maneja:
 * 1. Navegación responsive con backdrop blur
 * 2. Carga de reseñas (GET) desde Google Sheets
 * 3. Envío de nuevas reseñas (POST) a Google Sheets
 * 4. Scroll reveal animaciones
 * 5. Sistema de estrellas interactivas
 */

import { cargarResenas, enviarResena, initStarRating } from '../assets/js/reviews.js';

// ========== NAVEGACIÓN ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
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
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .promo-card, .quick-book-card, .contact-item, .review-form-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ========== SISTEMA DE RESEÑAS ==========

/**
 * FETCH GET - Cargar reseñas al iniciar:
 * Hace una petición GET al endpoint de Google Sheets.
 * El servidor devuelve un JSON con las reseñas guardadas.
 * Se renderizan como tarjetas con estrellas (★) visuales.
 */
cargarResenas('reviewsContainer', 'modern');

/**
 * Inicializar estrellas interactivas del formulario.
 */
initStarRating('starRating');

/**
 * FETCH POST - Enviar nueva reseña:
 * Recoge nombre, comentario y calificación del formulario.
 * Envía JSON al endpoint con fetch POST.
 * Google Apps Script lo guarda en la hoja de cálculo.
 */
const reviewForm = document.getElementById('reviewForm');
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarResena('reviewForm', 'reviewsContainer', 'modern');
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

console.log('🏢 Almighty Studio - Propuesta Moderna cargada correctamente');
