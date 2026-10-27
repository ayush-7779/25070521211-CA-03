import express from 'express';
import { getProductModel } from '../db.js';

const router = express.Router();

// GET all products with filtering, search, sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, q, sort, minPrice, maxPrice, inStock } = req.query;
    const Product = getProductModel();

    let filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const searchQuery = search || q;
    if (searchQuery && searchQuery.trim()) {
      const regex = new RegExp(searchQuery.trim(), 'i');
      filter.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    let products = await Product.find(filter);

    // Apply price range filter if provided
    if (minPrice) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Filter inStock
    if (inStock === 'true') {
      products = products.filter((p) => p.stockCount > 0);
    }

    // Sort
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Format products for response
    const formatted = products.map((p) => {
      const doc = p.toJSON ? p.toJSON() : p;
      return {
        ...doc,
        id: doc.id || doc._id?.toString(),
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      products: formatted,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products', error: err.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const Product = getProductModel();
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const doc = product.toJSON ? product.toJSON() : product;
    res.json({
      success: true,
      product: {
        ...doc,
        id: doc.id || doc._id?.toString(),
      },
    });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, description, price, originalPrice, category, image, stockCount, tag, features, specs } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ success: false, message: 'Title, price, and category are required' });
    }

    const Product = getProductModel();
    const newProduct = await Product.create({
      title,
      subtitle: subtitle || '',
      description: description || 'Premium product designed with elegance and performance.',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.2,
      category,
      image: image || '/images/products/apex-headphones.jpg',
      stockCount: stockCount ? parseInt(stockCount, 10) : 10,
      inStock: (stockCount || 10) > 0,
      tag: tag || 'New',
      features: Array.isArray(features) ? features : (features ? [features] : ['Premium finish', 'High performance']),
      specs: specs || {},
      rating: 5.0,
      numReviews: 1,
    });

    const doc = newProduct.toJSON ? newProduct.toJSON() : newProduct;
    res.status(201).json({
      success: true,
      product: {
        ...doc,
        id: doc.id || doc._id?.toString(),
      },
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Failed to create product', error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const Product = getProductModel();
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
});

export default router;
