import express from 'express';
import { getOrderModel, getProductModel } from '../db.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const Order = getOrderModel();
    const orders = await Order.find();

    const formatted = orders.map((o) => {
      const doc = o.toJSON ? o.toJSON() : o;
      return {
        ...doc,
        id: doc.id || doc._id?.toString(),
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      orders: formatted,
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: err.message });
  }
});

// GET single order by ID or orderNumber
router.get('/:id', async (req, res) => {
  try {
    const Order = getOrderModel();
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const doc = order.toJSON ? order.toJSON() : order;
    res.json({
      success: true,
      order: {
        ...doc,
        id: doc.id || doc._id?.toString(),
      },
    });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST create new order (checkout)
router.post('/', async (req, res) => {
  try {
    const { items, customer, promoCode, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
    }

    if (!customer || !customer.fullName || !customer.email || !customer.address || !customer.city || !customer.postalCode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Apply promo code discount
    let discount = 0;
    const cleanPromo = (promoCode || '').trim().toUpperCase();
    if (cleanPromo === 'LUMINA20') {
      discount = subtotal * 0.20;
    } else if (cleanPromo === 'WELCOME10') {
      discount = subtotal * 0.10;
    }

    // Shipping: Free if subtotal > $200, else $15
    const shipping = subtotal > 200 ? 0 : 15;

    // Tax: 8.5%
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.085;

    // Final total
    const total = taxableAmount + shipping + tax;

    // Order number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `LUM-${randomSuffix}`;

    const Order = getOrderModel();
    const Product = getProductModel();

    // Create the order
    const newOrder = await Order.create({
      orderNumber,
      items: items.map((i) => ({
        productId: i.productId || i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        postalCode: customer.postalCode.trim(),
        country: customer.country || 'United States',
      },
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      promoCode: cleanPromo,
      paymentMethod: paymentMethod || 'Instant Card Payment (Encrypted Demo)',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
    });

    // Update product stock counts
    for (const item of items) {
      try {
        const prodId = item.productId || item.id;
        const prod = await Product.findById(prodId);
        if (prod) {
          const newStock = Math.max(0, (prod.stockCount || 10) - item.quantity);
          await Product.findByIdAndUpdate(prodId, {
            stockCount: newStock,
            inStock: newStock > 0,
          });
        }
      } catch (stockErr) {
        console.warn('Could not update product stock:', stockErr.message);
      }
    }

    const doc = newOrder.toJSON ? newOrder.toJSON() : newOrder;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        ...doc,
        id: doc.id || doc._id?.toString(),
      },
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'Failed to place order', error: err.message });
  }
});

export default router;
