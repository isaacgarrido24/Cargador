/**
 * ==================== BACKEND EJEMPLO ====================
 * Este es un ejemplo de servidor backend usando Node.js + Express
 * Para usar este archivo, necesitas:
 * 
 * 1. Instalar Node.js desde https://nodejs.org
 * 2. Crear una carpeta backend y copiar este archivo
 * 3. Ejecutar: npm init -y
 * 4. Ejecutar: npm install express cors dotenv mongoose stripe
 * 5. Ejecutar: node server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Stripe = require('stripe');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ==================== ESQUEMAS ====================

// Esquema de Producto
const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    originalPrice: Number,
    description: String,
    image: String,
    stock: Number,
    rating: Number,
    reviews: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Esquema de Orden
const orderSchema = new mongoose.Schema({
    orderId: String,
    customerId: String,
    customerEmail: String,
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: Number,
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
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
    transactionId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Esquema de Reseña
const reviewSchema = new mongoose.Schema({
    productId: String,
    customerId: String,
    name: String,
    email: String,
    rating: Number,
    title: String,
    text: String,
    helpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Crear modelos
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);

// ==================== CONEXIÓN A BASE DE DATOS ====================

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/cargapro')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==================== RUTAS DE PRODUCTOS ====================

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== RUTAS DE ÓRDENES ====================

// Crear una nueva orden
app.post('/api/orders', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Validar datos
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'La orden debe contener al menos un artículo'
            });
        }

        // Calcular total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Crear orden
        const order = new Order({
            orderId: 'ORD-' + Date.now(),
            customerEmail: shippingAddress.email,
            items,
            total,
            shippingAddress,
            paymentMethod,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            success: true,
            data: order,
            message: 'Orden creada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Obtener una orden por ID
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada'
            });
        }
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Actualizar estado de orden
app.patch('/api/orders/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada'
            });
        }

        res.json({
            success: true,
            data: order,
            message: 'Orden actualizada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== RUTAS DE PAGOS ====================

// Crear intención de pago con Stripe
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', description } = req.body;

        // Crear intención de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe usa centavos
            currency,
            description,
            metadata: {
                integration_check: 'accept_a_payment'
            }
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Confirmar pago
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        // Obtener estado del pago en Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Actualizar orden a pagada
            const order = await Order.findOneAndUpdate(
                { orderId },
                { 
                    status: 'paid',
                    transactionId: paymentIntentId,
                    updatedAt: Date.now()
                },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Pago confirmado',
                data: order
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Pago no completado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== RUTAS DE RESEÑAS ====================

// Obtener reseñas de un producto
app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        const rating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.json({
            success: true,
            data: reviews,
            rating,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Crear una reseña
app.post('/api/reviews', async (req, res) => {
    try {
        const { productId, name, email, rating, title, text } = req.body;

        // Validar datos
        if (!productId || !name || !email || !rating || !title || !text) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }

        const review = new Review({
            productId,
            name,
            email,
            rating,
            title,
            text,
            verified: true // En un caso real, verificarías si el usuario compró el producto
        });

        await review.save();

        res.status(201).json({
            success: true,
            data: review,
            message: 'Reseña creada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== RUTAS DE UTILIDADES ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Estadísticas
app.get('/api/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalReviews = await Review.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalReviews,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== MANEJO DE ERRORES ====================

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

// Error handler global
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error interno del servidor'
    });
});

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.API_PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    ============================================
    🚀 Servidor CargaPro ejecutándose
    📍 Puerto: ${PORT}
    🔗 URL: http://localhost:${PORT}
    ============================================
    `);
});

// Exportar app para testing
module.exports = app;
