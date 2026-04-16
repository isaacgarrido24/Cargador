// ==================== Estado Global ====================
const state = {
    cart: [],
    rating: 5,
    product: {
        id: 1,
        name: 'CargaPro Ultra 100W',
        price: 49.99,
        originalPrice: 79.99,
        image: 'cargador.png'
    }
};

// ==================== Cantidad de Producto ====================
function increaseQuantity() {
    const input = document.getElementById('cantidad');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('cantidad');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ==================== Carrito ====================
function addToCart() {
    const quantity = parseInt(document.getElementById('cantidad').value);
    
    // Verificar si el producto ya está en el carrito
    const existingItem = state.cart.find(item => item.id === state.product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: state.product.id,
            name: state.product.name,
            price: state.product.price,
            quantity: quantity
        });
    }
    
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} agregado al carrito`);
    
    // Reset cantidad
    document.getElementById('cantidad').value = 1;
}

function updateCartCount() {
    const count = state.cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.carrito-count').textContent = count;
}

function openCart() {
    const modal = document.getElementById('carritoModal');
    modal.classList.add('active');
    renderCartItems();
}

function closeCart() {
    document.getElementById('carritoModal').classList.remove('active');
}

function renderCartItems() {
    const container = document.getElementById('carritoItems');
    
    if (state.cart.length === 0) {
        container.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        updateCartTotals();
        return;
    }
    
    let html = '';
    state.cart.forEach((item, index) => {
        html += `
            <div class="carrito-item">
                <div class="carrito-item-imagen"></div>
                <div class="carrito-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="carrito-item-remove" onclick="removeFromCart(${index})">Quitar</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateCartTotals();
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
}

function updateCartTotals() {
    const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% impuesto
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + tax + shipping;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('impuesto').textContent = '$' + tax.toFixed(2);
    document.getElementById('envio').textContent = shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

// ==================== Checkout ====================
function proceedToCheckout() {
    if (state.cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    closeCart();
    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Validación básica
    const form = e.target;
    const formData = new FormData(form);
    
    // Simular procesamiento de pago
    showNotification('Procesando pago...', 'loading');
    
    setTimeout(() => {
        // Simular éxito del pago (90% de probabilidad)
        if (Math.random() > 0.1) {
            showNotification('¡Pago completado exitosamente! Tu pedido ha sido confirmado.', 'success');
            state.cart = [];
            updateCartCount();
            closeCheckout();
            form.reset();
        } else {
            showNotification('Error al procesar el pago. Por favor intenta de nuevo.', 'error');
        }
    }, 2000);
}

// Formatear número de tarjeta
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});

// ==================== Reseñas ====================
function openReviewModal() {
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
}

function setRating(rating) {
    state.rating = rating;
    document.getElementById('reviewRating').value = rating;
    
    // Actualizar visualización de estrellas
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
});

function handleReviewSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewName').value;
    const email = document.getElementById('reviewEmail').value;
    const title = document.getElementById('reviewTitle').value;
    const text = document.getElementById('reviewText').value;
    const rating = document.getElementById('reviewRating').value;
    
    // Crear nueva reseña
    const newReview = `
        <div class="resena-card">
            <div class="resena-header">
                <div class="resena-user">
                    <div class="user-avatar">${name.substring(0, 2).toUpperCase()}</div>
                    <div class="user-info">
                        <h4>${name}</h4>
                        <span class="verified">✓ Compra verificada</span>
                    </div>
                </div>
                <div class="resena-stars">${'⭐'.repeat(rating)}</div>
            </div>
            <p class="resena-title"><strong>${title}</strong></p>
            <p class="resena-texto">${text}</p>
            <span class="resena-fecha">Hace unos momentos</span>
            <div class="resena-helpful">
                <button onclick="markHelpful(this)">👍 Útil (0)</button>
            </div>
        </div>
    `;
    
    // Insertar la nueva reseña al inicio de la lista
    const resenasList = document.querySelector('.resenas-list');
    resenasList.insertAdjacentHTML('afterbegin', newReview);
    
    closeReviewModal();
    document.getElementById('reviewForm').reset();
    
    showNotification('¡Reseña publicada exitosamente!');
}

function markHelpful(button) {
    const currentText = button.textContent;
    const match = currentText.match(/(\d+)/);
    const currentCount = match ? parseInt(match[1]) : 0;
    
    button.textContent = `👍 Útil (${currentCount + 1})`;
    button.disabled = true;
    button.style.opacity = '0.6';
}

function loadMoreReviews() {
    showNotification('Cargando más reseñas...');
    
    setTimeout(() => {
        showNotification('Se cargaron 5 reseñas más');
    }, 1000);
}

// ==================== Modales Genéricos ====================
// Cerrar modales al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    const carritoModal = document.getElementById('carritoModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const reviewModal = document.getElementById('reviewModal');
    
    if (event.target === carritoModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
    if (event.target === reviewModal) {
        closeReviewModal();
    }
});

// ==================== Notificaciones ====================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'loading' ? '#3b82f6' : '#f59e0b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
    `;
    
    if (type === 'loading') {
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span>
                ${message}
            </div>
        `;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Agregar animaciones CSS dinámicas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ==================== Interactividad adicional ====================
// Vincular botón del carrito en el navbar
document.addEventListener('DOMContentLoaded', function() {
    const carritoBtn = document.querySelector('.carrito-btn');
    if (carritoBtn) {
        carritoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
});

// Cambiar imagen principal
function changeImage(element) {
    const imagenes = document.querySelectorAll('.mini-img');
    imagenes.forEach(img => img.style.borderColor = 'transparent');
    element.style.borderColor = '#3b82f6';
}

// Scroll suave para enlaces
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#carrito' && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// ==================== Validación de formularios ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhoneNumber(phone) {
    return phone.length >= 10;
}

// ==================== Análisis y Tracking (opcional) ====================
function trackEvent(eventName, eventData = {}) {
    console.log(`Event: ${eventName}`, eventData);
    // Aquí podrías enviar datos a Google Analytics, Mixpanel, etc.
}

// Registrar cuando el usuario agrega al carrito
document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.querySelector('.btn-comprar');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            trackEvent('add_to_cart', {
                product: state.product.name,
                price: state.product.price
            });
        });
    }
});

// ==================== LocalStorage (Persistencia del carrito) ====================
function saveCart() {
    localStorage.setItem('cargador_cart', JSON.stringify(state.cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cargador_cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Guardar carrito cuando cambia
const originalAddToCart = addToCart;
addToCart = function() {
    originalAddToCart();
    saveCart();
};

// Cargar carrito al inicio
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

// ==================== Inicialización ====================
console.log('CargaPro Shop initialized successfully');
