import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { initialProducts } from './data/products.js';
import { Product as MongoProduct } from './models/Product.js';
import { Order as MongoOrder } from './models/Order.js';
import { User as MongoUser } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'data', 'store.json');

let isMongoConnected = false;
let dbMode = 'Checking...';

// Pre-hashed demo password for 'Password123!'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

const DEMO_USER = {
  _id: 'usr_demo_alexander',
  id: 'usr_demo_alexander',
  name: 'Alexander Vance',
  email: 'alexander.vance@lumina-tech.com',
  password: DEMO_PASSWORD_HASH,
  role: 'vip',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  shippingAddress: {
    address: '742 Evergreen Terrace, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// File-backed fallback store to ensure zero downtime if local MongoDB is offline
class FileStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = { products: [], orders: [], users: [] };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.users) {
          this.data.users = [DEMO_USER];
          this.save();
        }
      } else {
        this.seedInitial();
      }
    } catch (err) {
      console.warn('[Storage] Error reading fallback store, reseeding:', err.message);
      this.seedInitial();
    }
  }

  seedInitial() {
    this.data = {
      products: initialProducts.map((p, idx) => ({
        ...p,
        _id: `prod_${Date.now()}_${idx}`,
        id: `prod_${Date.now()}_${idx}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      orders: [],
      users: [DEMO_USER],
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Error writing store file:', err.message);
    }
  }
}

const fileStore = new FileStore(STORE_PATH);

// Embedded Store Adapter that mirrors Mongoose model API
export const EmbeddedProduct = {
  async find(filter = {}) {
    let list = [...fileStore.data.products];
    if (filter.category && filter.category !== 'All') {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter.$or) {
      const titleRegex = filter.$or[0]?.title?.$regex;
      if (titleRegex) {
        list = list.filter(
          (p) =>
            titleRegex.test(p.title) ||
            titleRegex.test(p.description) ||
            titleRegex.test(p.category)
        );
      }
    }
    return list;
  },

  async findById(id) {
    return fileStore.data.products.find((p) => p.id === id || p._id === id) || null;
  },

  async create(productData) {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newProduct = {
      ...productData,
      _id: id,
      id,
      rating: productData.rating || 4.8,
      numReviews: productData.numReviews || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fileStore.data.products.unshift(newProduct);
    fileStore.save();
    return newProduct;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = fileStore.data.products.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return null;
    const current = fileStore.data.products[idx];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    fileStore.data.products[idx] = updated;
    fileStore.save();
    return updated;
  },

  async findByIdAndDelete(id) {
    const idx = fileStore.data.products.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return null;
    const removed = fileStore.data.products.splice(idx, 1)[0];
    fileStore.save();
    return removed;
  },

  async countDocuments() {
    return fileStore.data.products.length;
  },
};

export const EmbeddedOrder = {
  async find() {
    return [...fileStore.data.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  async findById(id) {
    return fileStore.data.orders.find((o) => o.id === id || o._id === id || o.orderNumber === id) || null;
  },

  async create(orderData) {
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newOrder = {
      ...orderData,
      _id: id,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fileStore.data.orders.unshift(newOrder);
    fileStore.save();
    return newOrder;
  },

  async countDocuments() {
    return fileStore.data.orders.length;
  },
};

export const EmbeddedUser = {
  async findOne(query) {
    if (query.email) {
      const email = query.email.toLowerCase().trim();
      return fileStore.data.users.find((u) => u.email.toLowerCase() === email) || null;
    }
    return null;
  },

  async findById(id) {
    const user = fileStore.data.users.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    return user;
  },

  async create(userData) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser = {
      ...userData,
      _id: id,
      id,
      role: userData.role || 'customer',
      avatar: userData.avatar || '',
      shippingAddress: userData.shippingAddress || {
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fileStore.data.users.push(newUser);
    fileStore.save();
    return newUser;
  },
};

// Prevent unhandled error event crash from Mongoose connection
mongoose.connection.on('error', (err) => {
  // Handled gracefully
});

// Connect to MongoDB or fallback gracefully
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumina_ecommerce';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });

    isMongoConnected = true;
    dbMode = 'MongoDB (Active Live Connection)';
    console.log('✅ [MongoDB] Connected successfully to live MongoDB instance!');

    // Seed products if empty
    const productCount = await MongoProduct.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial luxury products into MongoDB collection...');
      await MongoProduct.insertMany(initialProducts);
      console.log(`✨ [MongoDB] Seeded ${initialProducts.length} products successfully!`);
    }

    // Seed demo user if empty
    const userCount = await MongoUser.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [MongoDB] Seeding demo VIP user into MongoDB...');
      await MongoUser.create({
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        password: DEMO_USER.password,
        role: DEMO_USER.role,
        avatar: DEMO_USER.avatar,
        shippingAddress: DEMO_USER.shippingAddress,
      });
      console.log('✨ [MongoDB] Demo VIP user created (alexander.vance@lumina-tech.com / Password123!)');
    }
  } catch (err) {
    isMongoConnected = false;
    dbMode = 'Embedded Persistent Store (Fallback Mode)';
    await mongoose.disconnect().catch(() => {});
    console.warn('⚠️ [MongoDB] Local MongoDB daemon was not reachable.');
    console.warn(`⚠️ [MongoDB] Reason: ${err.message}`);
    console.log('🛡️ [Database] Activated resilient embedded database store.');
    console.log('💡 [Database] Tip: To connect to MongoDB Atlas, set MONGODB_URI in .env');
    console.log(`📦 [Database] Loaded ${fileStore.data.products.length} products and ${fileStore.data.users.length} users.`);
  }
}

// Dynamic Model Resolvers - seamlessly return Mongo Model if connected, or Embedded Model
export function getProductModel() {
  return isMongoConnected ? MongoProduct : EmbeddedProduct;
}

export function getOrderModel() {
  return isMongoConnected ? MongoOrder : EmbeddedOrder;
}

export function getUserModel() {
  return isMongoConnected ? MongoUser : EmbeddedUser;
}

export function getDbStatus() {
  return {
    isMongoConnected,
    dbMode,
    uri: process.env.MONGODB_URI ? 'Configured in .env' : 'mongodb://127.0.0.1:27017/lumina_ecommerce',
  };
}
