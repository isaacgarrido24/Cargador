# 🔧 Guía de Integración con Servicios Reales

Esta guía te ayudará a conectar tu tienda con servicios reales de pagos, email y analítica.

## 💳 Integración con Stripe

### Paso 1: Crear una cuenta en Stripe
1. Ve a https://stripe.com
2. Crea una cuenta gratuita
3. Obtén tus claves API (Publishable Key y Secret Key)

### Paso 2: Instalar Stripe.js
En tu `index.html`, agrega en la sección `<head>`:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Paso 3: Actualizar el formulario de pago
Reemplaza la validación básica en `js/main.js`:

```javascript
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    
    cardElement.mount('#card-element');
    
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    stripe.createToken(cardElement).then(function(result) {
        if (result.error) {
            showNotification('Error: ' + result.error.message, 'error');
        } else {
            // Crear el pago en tu servidor
            createPaymentIntent(result.token.id);
        }
    });
}

function createPaymentIntent(tokenId) {
    fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: tokenId,
            amount: calculateTotal()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Pago completado exitosamente!', 'success');
            state.cart = [];
            updateCartCount();
            closeCheckout();
        } else {
            showNotification('Error: ' + data.error, 'error');
        }
    });
}
```

## 📧 Integración con SendGrid

### Paso 1: Crear cuenta en SendGrid
1. Ve a https://sendgrid.com
2. Crea una cuenta gratuita
3. Obtén tu API Key

### Paso 2: Crear un backend simple (Node.js + Express)

```javascript
// backend/server.js
const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

app.post('/send-confirmation', async (req, res) => {
    const { email, customerName, orderId } = req.body;
    
    const msg = {
        to: email,
        from: 'orders@cargapro.com',
        subject: `¡Tu pedido #${orderId} ha sido confirmado!`,
        html: `
            <h1>¡Gracias por tu compra!</h1>
            <p>Hola ${customerName},</p>
            <p>Tu pedido ha sido confirmado.</p>
            <p><strong>Número de orden:</strong> ${orderId}</p>
            <p>Recibirás tu cargador en 3-5 días hábiles.</p>
            <p>¡Gracias por comprar en CargaPro!</p>
        `,
    };
    
    try {
        await sgMail.send(msg);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});
```

## 📊 Integración con Google Analytics

### Paso 1: Crear cuenta en Google Analytics
1. Ve a https://analytics.google.com
2. Crea una propiedad para tu sitio
3. Obtén tu Measurement ID (G-XXXXXXXXXX)

### Paso 2: Agregar el código de rastreo
En `index.html`, agrega antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Paso 3: Rastrear eventos personalizados
En `js/main.js`:

```javascript
function trackEvent(eventName, eventData = {}) {
    gtag('event', eventName, eventData);
}

// Usar en eventos importantes
function addToCart() {
    // ... código existente ...
    trackEvent('add_to_cart', {
        value: state.product.price,
        currency: 'USD',
        items: [{
            item_id: state.product.id,
            item_name: state.product.name,
            price: state.product.price
        }]
    });
}
```

## 🌐 Integración con MercadoPago (Latinoamérica)

### Paso 1: Crear cuenta en MercadoPago
1. Ve a https://www.mercadopago.com
2. Crea una cuenta
3. Obtén tu Public Key

### Paso 2: Agregar el SDK de MercadoPago
En `index.html`:

```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

### Paso 3: Implementar el checkout
```javascript
const mp = new MercadoPago('YOUR_PUBLIC_KEY');

function handleMercadoPagoCheckout() {
    const orderData = {
        title: 'CargaPro Ultra 100W',
        quantity: 1,
        price: 49.99,
        currency_id: 'USD',
        description: 'Cargador ultra rápido'
    };

    mp.checkout({
        preference: {
            items: [orderData],
            payer: {
                email: document.querySelector('input[type="email"]').value
            }
        },
        render: {
            container: '.mp-checkout',
            label: 'Pagar con MercadoPago',
        }
    });
}
```

## 🗄️ Base de Datos - MongoDB

### Instalación con Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Esquema de producto
```javascript
const productSchema = {
    id: String,
    name: String,
    price: Number,
    originalPrice: Number,
    description: String,
    image: String,
    specifications: {
        power: String,
        chargingTime: String,
        ports: String,
        weight: String
    },
    stock: Number,
    createdAt: Date,
    updatedAt: Date
};
```

### Esquema de orden
```javascript
const orderSchema = {
    id: String,
    customerId: String,
    products: [{
        productId: String,
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: String, // 'pending', 'paid', 'shipped', 'delivered'
    shippingAddress: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: String,
    createdAt: Date,
    updatedAt: Date
};
```

## 🚀 Backend Sample - Node.js Express

```javascript
// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Rutas
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ success: true, orderId: order.id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
```

## 📦 Deploy en Heroku

### Paso 1: Instalar Heroku CLI
```bash
npm install -g heroku
```

### Paso 2: Crear archivo Procfile
```
web: node backend/app.js
```

### Paso 3: Deploy
```bash
heroku login
heroku create tu-app-name
git push heroku main
```

## 🔐 Seguridad

### Checklist de seguridad
- [ ] Usar HTTPS (SSL certificate)
- [ ] Validar entrada en servidor
- [ ] Usar variables de entorno para API keys
- [ ] Implementar rate limiting
- [ ] Usar CSRF tokens
- [ ] Sanitizar input para prevenir XSS
- [ ] Usar Content Security Policy (CSP)
- [ ] Implementar CORS correctamente

### Ejemplo de CORS seguro
```javascript
const cors = require('cors');

const corsOptions = {
    origin: ['https://cargapro.com', 'https://www.cargapro.com'],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
```

## 📱 Implementar PWA (Progressive Web App)

### Crear manifest.json
```json
{
    "name": "CargaPro Shop",
    "short_name": "CargaPro",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### Agregar a index.html
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#3b82f6">
<link rel="apple-touch-icon" href="/icon-192.png">
```

---

## 🎓 Recursos Útiles

- **Stripe Docs**: https://stripe.com/docs
- **MercadoPago Docs**: https://www.mercadopago.com.ar/developers/es
- **Node.js Docs**: https://nodejs.org/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Google Analytics**: https://support.google.com/analytics

¡Mucho éxito con tu tienda online! 🚀
