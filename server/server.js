import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus, getProductModel, getOrderModel } from './db.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static images and assets from public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// Database & System status
app.get('/api/status', (req, res) => {
  const status = getDbStatus();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: status,
    version: '1.0.0',
    app: 'Lumina Luxury E-Commerce Platform',
  });
});

// Analytics & store stats
app.get('/api/stats', async (req, res) => {
  try {
    const Product = getProductModel();
    const Order = getOrderModel();

    const [products, orders] = await Promise.all([
      Product.find(),
      Order.find(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalItemsSold = orders.reduce(
      (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0),
      0
    );

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalItemsSold,
        dbStatus: getDbStatus(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Stats error', error: err.message });
  }
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    name: 'Lumina E-Commerce API',
    endpoints: ['/api/products', '/api/orders', '/api/status', '/api/stats'],
  });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Lumina E-Commerce API running on http://localhost:${PORT}`);
  });
}

startServer();
