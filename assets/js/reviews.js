/**
 * =====================================================
 * MÓDULO DE RESEÑAS - Conexión con Google Sheets
 * =====================================================
 * 
 * Este módulo maneja toda la lógica de reseñas:
 * - GET: Carga reseñas existentes desde Google Sheets
 * - POST: Envía nuevas reseñas a Google Sheets
 * 
 * ENDPOINT: Google Apps Script que actúa como API REST
 * conectado a una hoja de cálculo de Google Sheets.
 */

const REVIEWS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwFerUGNAJ00pK-v7bzYYIUhL-MHmx8CRjRA87PTQ2UdAI26YGSFEonjTMiFGdTlCw6_w/exec';

/**
 * FETCH GET - Cargar reseñas existentes
 * 
 * Cómo funciona:
 * 1. Se hace una petición GET al endpoint de Google Sheets
 * 2. El endpoint devuelve un JSON con todas las reseñas almacenadas
 * 3. Cada reseña contiene: nombre, comentario, calificacion, fecha
 * 4. Las reseñas se ordenan por fecha (más recientes primero)
 * 5. Se renderizan como tarjetas HTML en el contenedor indicado
 */
export async function cargarResenas(containerId, styleVariant = 'classic') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Mostrar estado de carga
    container.innerHTML = `<div class="reviews-loading"><div class="spinner"></div><p>Cargando reseñas...</p></div>`;

    try {
        const response = await fetch(REVIEWS_ENDPOINT);
        const data = await response.json();

        // Verificar si hay reseñas
        if (!data || !data.data || data.data.length === 0) {
            container.innerHTML = '<p class="no-reviews">Aún no hay reseñas. ¡Sé el primero en dejar la tuya!</p>';
            return;
        }

        // Ordenar por más recientes primero (si tienen fecha)
        const resenas = data.data.sort((a, b) => {
            if (a.fecha && b.fecha) {
                return new Date(b.fecha) - new Date(a.fecha);
            }
            return 0;
        });

        // Renderizar tarjetas de reseñas
        container.innerHTML = resenas.map(r => crearTarjetaResena(r, styleVariant)).join('');

        // Animar la entrada de las tarjetas
        const cards = container.querySelectorAll('.review-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });

    } catch (error) {
        console.error('Error al cargar reseñas:', error);
        container.innerHTML = '<p class="reviews-error">Error al cargar reseñas. Intenta de nuevo más tarde.</p>';
    }
}

/**
 * Crear HTML de tarjeta de reseña
 * Convierte la calificación numérica en estrellas visuales (★)
 */
function crearTarjetaResena(resena, variant) {
    const { Nombre = 'Anónimo', Comentario = '', Calificacion = 5 } = resena;
    const estrellas = generarEstrellas(Number(Calificacion));

    return `
        <div class="review-card review-${variant}">
            <div class="review-header">
                <div class="review-avatar">${Nombre.charAt(0).toUpperCase()}</div>
                <div class="review-info">
                    <h4 class="review-name">${escapeHTML(Nombre)}</h4>
                    <div class="review-stars">${estrellas}</div>
                </div>
            </div>
            <p class="review-text">"${escapeHTML(Comentario)}"</p>
        </div>
    `;
}

/**
 * Generar estrellas visuales a partir de calificación numérica
 * Ejemplo: 4 → ★★★★☆
 */
function generarEstrellas(Calificacion) {
    const max = 5;
    const llenas = Math.min(Math.max(Math.round(Calificacion), 0), max);
    const vacias = max - llenas;
    return '★'.repeat(llenas) + '☆'.repeat(vacias);
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * FETCH POST - Enviar nueva reseña
 * 
 * Cómo funciona:
 * 1. Se recogen los datos del formulario (nombre, comentario, calificación)
 * 2. Se validan los campos (no vacíos, calificación entre 1-5)
 * 3. Se envía una petición POST al endpoint con JSON.stringify()
 * 4. Google Apps Script recibe los datos y los guarda en Google Sheets
 * 5. Se muestra confirmación al usuario y se recargan las reseñas
 * 
 * NOTA: Se usa mode: 'no-cors' porque Google Apps Script
 * no permite CORS directo en algunos casos. La petición se
 * envía igualmente y los datos se guardan correctamente.
 */
export async function enviarResena(formId, containerId, styleVariant = 'classic') {
    const form = document.getElementById(formId);
    if (!form) return;

    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const comentario = form.querySelector('[name="comentario"]').value.trim();
    const calificacion = form.querySelector('[name="calificacion"]').value;

    // Validaciones
    if (!nombre || !comentario) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }

    if (calificacion < 1 || calificacion > 5) {
        mostrarNotificacion('La calificación debe ser entre 1 y 5', 'error');
        return;
    }

    // Deshabilitar botón durante envío
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        // Enviar reseña al endpoint (POST)
        await fetch(REVIEWS_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                comentario,
                calificacion: Number(calificacion)
            })
        });

        // Mostrar éxito
        mostrarNotificacion('¡Gracias por tu reseña! Se publicará en breve.', 'success');
        form.reset();

        // Recargar reseñas después de 2 segundos
        setTimeout(() => {
            cargarResenas(containerId, styleVariant);
        }, 2000);

    } catch (error) {
        console.error('Error al enviar reseña:', error);
        mostrarNotificacion('Error al enviar tu reseña. Intenta de nuevo.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Mostrar notificación flotante
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Remover notificación existente
    const existing = document.querySelector('.review-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `review-notification notification-${tipo}`;
    notification.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
    `;
    document.body.appendChild(notification);

    // Auto-remover después de 4 segundos
    setTimeout(() => {
        notification.classList.add('notification-fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

/**
 * Inicializar sistema de calificación con estrellas interactivas
 */
export function initStarRating(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stars = container.querySelectorAll('.star-btn');
    const input = container.querySelector('input[name="calificacion"]');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.dataset.value;
            input.value = value;
            stars.forEach(s => {
                s.classList.toggle('active', s.dataset.value <= value);
            });
        });

        star.addEventListener('mouseenter', () => {
            const value = star.dataset.value;
            stars.forEach(s => {
                s.classList.toggle('hover', s.dataset.value <= value);
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}
