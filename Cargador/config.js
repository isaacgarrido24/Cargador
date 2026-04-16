// ==================== CONFIGURACIÓN ====================
// Archivo de configuración centralizado para la tienda

const CONFIG = {
    // Información del sitio
    site: {
        name: 'CargaPro',
        title: 'CargaPro - Cargador Ultra Profesional',
        description: 'El mejor cargador rápido del mercado con tecnología avanzada',
        version: '1.0.0',
        author: 'Tu Nombre',
        year: new Date().getFullYear()
    },

    // Información de contacto
    contact: {
        email: 'info@cargapro.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, San Francisco, CA',
        country: 'USA'
    },

    // Redes sociales
    social: {
        facebook: 'https://facebook.com/cargapro',
        instagram: 'https://instagram.com/cargapro',
        twitter: 'https://twitter.com/cargapro',
        linkedin: 'https://linkedin.com/company/cargapro'
    },

    // Configuración de productos
    product: {
        id: 1,
        name: 'CargaPro Ultra 100W',
        description: 'Cargador universal ultra rápido con tecnología avanzada',
        price: 49.99,
        originalPrice: 79.99,
        discount: 37,
        currency: 'USD',
        sku: 'CARGAPRO-100W',
        stock: 100,
        weight: '250g',
        specifications: {
            power: '100W',
            chargingTime: '20-30 minutos',
            ports: 'USB-C x2, Lightning',
            dimensions: '12 x 8 x 3 cm',
            warranty: '3 años'
        },
        features: [
            'Carga ultra rápida de 100W',
            'Compatible con todos los dispositivos',
            'Protección térmica inteligente',
            'Batería de carga rápida',
            'Puertos USB-C y Lightning',
            'Garantía de 3 años'
        ]
    },

    // Configuración de envío
    shipping: {
        freeShippingThreshold: 50,
        standardShippingCost: 10,
        standardShippingDays: '3-5',
        expressDays: '1-2',
        expressCost: 25,
        countries: ['USA', 'Mexico', 'Canada'],
        internationalAvailable: true
    },

    // Configuración de impuestos
    tax: {
        rate: 0.08, // 8%
        type: 'VAT', // VAT, Sales Tax
        included: false // Si está incluido en el precio
    },

    // Configuración de pago
    payment: {
        methods: ['credit-card', 'debit-card', 'paypal', 'stripe', 'mercadopago'],
        currencies: ['USD', 'EUR', 'MXN'],
        // API Keys (NO coloques aquí en producción, usa variables de entorno)
        stripe: {
            publishableKey: 'pk_test_YOUR_KEY_HERE',
            enabled: false // Cambiar a true cuando esté configurado
        },
        mercadopago: {
            publicKey: 'APP_USR-YOUR_KEY_HERE',
            enabled: false
        }
    },

    // Configuración de seguridad
    security: {
        enableSSL: true,
        enableCSRF: true,
        rateLimit: {
            enabled: true,
            maxRequests: 100,
            timeWindow: 15 * 60 * 1000 // 15 minutos
        }
    },

    // Configuración de email
    email: {
        // SendGrid
        sendgrid: {
            apiKey: 'SG.YOUR_API_KEY_HERE',
            fromEmail: 'orders@cargapro.com',
            fromName: 'CargaPro'
        },
        // Mailgun
        mailgun: {
            apiKey: 'YOUR_API_KEY_HERE',
            domain: 'mail.cargapro.com'
        },
        // Templates
        templates: {
            orderConfirmation: 'order-confirmation',
            shipmentNotification: 'shipment-notification',
            customerReview: 'customer-review-request'
        }
    },

    // Configuración de analítica
    analytics: {
        googleAnalytics: {
            enabled: false,
            measurementId: 'G-XXXXXXXXXX'
        },
        mixpanel: {
            enabled: false,
            token: 'YOUR_TOKEN_HERE'
        },
        hotjar: {
            enabled: false,
            siteId: 'YOUR_SITE_ID'
        }
    },

    // Configuración de base de datos
    database: {
        type: 'mongodb', // mongodb, postgresql, mysql
        connection: process.env.DATABASE_URL || 'mongodb://localhost:27017/cargapro'
    },

    // Configuración de API
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
        timeout: 10000,
        retries: 3
    },

    // Configuración de moneda
    currency: {
        symbol: '$',
        code: 'USD',
        locale: 'en-US'
    },

    // Configuración de idioma
    language: {
        default: 'es',
        supported: ['es', 'en', 'pt', 'fr'],
        rtl: false
    },

    // Configuración de búsqueda
    search: {
        enabled: true,
        elasticsearch: {
            enabled: false,
            host: 'localhost:9200'
        }
    },

    // Configuración de caché
    cache: {
        enabled: true,
        ttl: 3600, // 1 hora
        type: 'redis' // memory, redis
    },

    // Configuración de almacenamiento
    storage: {
        type: 'local', // local, s3, gcs, azure
        uploadDir: './uploads',
        maxFileSize: 5 * 1024 * 1024 // 5MB
    },

    // Validación
    validation: {
        minPasswordLength: 8,
        maxProductNameLength: 255,
        maxReviewLength: 5000,
        acceptedImageFormats: ['jpg', 'jpeg', 'png', 'webp']
    },

    // Paginación
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
    },

    // URLs
    urls: {
        website: 'https://cargapro.com',
        documentation: 'https://docs.cargapro.com',
        help: 'https://help.cargapro.com',
        status: 'https://status.cargapro.com'
    },

    // Mensajes
    messages: {
        success: {
            addToCart: 'Producto agregado al carrito',
            orderPlaced: '¡Pedido creado exitosamente!',
            reviewSubmitted: '¡Reseña publicada!',
            profileUpdated: 'Perfil actualizado'
        },
        error: {
            outOfStock: 'Producto agotado',
            invalidEmail: 'Email inválido',
            paymentFailed: 'Error al procesar pago',
            serverError: 'Error del servidor. Intenta nuevamente.'
        },
        warning: {
            lowStock: 'Pocas unidades disponibles',
            priceChanged: 'El precio ha cambiado'
        }
    },

    // Funciones auxiliares
    getProductPrice: function() {
        return {
            current: this.product.price,
            original: this.product.originalPrice,
            discount: this.product.discount,
            discountAmount: (this.product.originalPrice - this.product.price).toFixed(2)
        };
    },

    getShippingCost: function(subtotal) {
        if (subtotal >= this.shipping.freeShippingThreshold) {
            return 0;
        }
        return this.shipping.standardShippingCost;
    },

    calculateTax: function(amount) {
        return (amount * this.tax.rate).toFixed(2);
    },

    formatCurrency: function(amount) {
        return new Intl.NumberFormat(this.currency.locale, {
            style: 'currency',
            currency: this.currency.code
        }).format(amount);
    },

    getEnvironment: function() {
        return {
            isDevelopment: true,
            isProduction: false,
            isStaging: false
        };
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

console.log('CONFIG initialized:', CONFIG);
