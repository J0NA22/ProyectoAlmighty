/**
 * =====================================================
 * PROPUESTA 1: APP.JS - Estilo Clásico / Elegante
 * =====================================================
 * 
 * Este archivo maneja:
 * 1. Navegación responsive y scroll effects
 * 2. Carga de reseñas (GET) desde Google Sheets
 * 3. Envío de nuevas reseñas (POST) a Google Sheets
 * 4. Animaciones de scroll reveal
 * 5. Sistema de estrellas interactivas
 */

import { cargarResenas, enviarResena, initStarRating } from '../assets/js/reviews.js';

// ========== NAVEGACIÓN ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Efecto scroll en la navbar
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Toggle menú móvil
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer click en un link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ========== SCROLL REVEAL ==========
// Animar elementos al entrar en el viewport
const observerOptions = {
    threshold: 0.1,
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

// Agregar clase reveal a elementos que queremos animar
document.querySelectorAll('.service-card, .promo-card, .about-content, .about-image, .gallery-item, .booking-info, .booking-map, .review-form-wrapper').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ========== SISTEMA DE RESEÑAS ==========

/**
 * FETCH GET - Al cargar la página:
 * Se hace una petición GET al endpoint de Google Sheets
 * para obtener todas las reseñas almacenadas.
 * Las reseñas se renderizan automáticamente como tarjetas
 * en el contenedor #reviewsContainer.
 */
cargarResenas('reviewsContainer', 'classic');

/**
 * Sistema de calificación con estrellas interactivas.
 * Cada estrella es un botón que al hacer click actualiza
 * el valor del input oculto 'calificacion'.
 */
initStarRating('starRating');

/**
 * FETCH POST - Enviar nueva reseña:
 * Al enviar el formulario, se recogen los datos (nombre,
 * comentario, calificación) y se envían al endpoint con
 * fetch POST + JSON.stringify(). Después se recargan las
 * reseñas para mostrar la nueva.
 */
const reviewForm = document.getElementById('reviewForm');
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarResena('reviewForm', 'reviewsContainer', 'classic');
});

// ========== SMOOTH SCROLL PARA LINKS INTERNOS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Altura del navbar
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active-link', scrollPos >= top && scrollPos < top + height);
        }
    });
});

console.log('✂ Almighty Barbershop - Propuesta Clásica cargada correctamente');
