# 🌟 LUMINA — Full Stack E-Commerce Platform

A premium luxury tech e-commerce site built with **React + Node.js + MongoDB**.

---

## 📁 Project Structure

```
lumina-ecommerce/
├── client/                  ← React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx      ← Login & Signup page
│   │   │   ├── Navbar.jsx        ← Top navigation with user info
│   │   │   ├── Hero.jsx          ← Landing page hero section
│   │   │   ├── ProductCard.jsx   ← Product grid card
│   │   │   ├── ProductModal.jsx  ← Product detail popup
│   │   │   ├── CartDrawer.jsx    ← Slide-in cart
│   │   │   ├── CheckoutModal.jsx ← Checkout & order placement
│   │   │   ├── OrdersModal.jsx   ← Order history
│   │   │   ├── AddProductModal.jsx ← Admin: add product
│   │   │   └── Toast.jsx         ← Notifications
│   │   ├── App.jsx               ← Root app with auth gate
│   │   ├── App.css               ← Component styles
│   │   ├── index.css             ← Global design tokens
│   │   └── main.jsx              ← React entry point
│   ├── public/
│   │   └── images/products/      ← Product images
│   ├── index.html
│   ├── vite.config.js            ← Vite + API proxy config
│   └── package.json
│
├── server/                  ← Node.js + Express Backend
│   ├── models/
│   │   ├── User.js               ← Mongoose User schema
│   │   ├── Product.js            ← Mongoose Product schema
│   │   └── Order.js              ← Mongoose Order schema
│   ├── routes/
│   │   ├── auth.js               ← POST /api/auth/login, /signup, GET /me
│   │   ├── products.js           ← CRUD /api/products
│   │   └── orders.js             ← CRUD /api/orders
│   ├── data/
│   │   └── products.js           ← Initial seed data
│   ├── db.js                     ← MongoDB + fallback embedded store
│   └── server.js                 ← Express app entry point
│
├── .env                     ← Environment variables
├── package.json             ← Root: runs both client & server
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install root + server dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### 2. Run Both (Development)

```bash
npm run dev
```

This starts:
- **Backend** → `http://localhost:5001`
- **Frontend** → `http://localhost:5173`

### Or run separately:

```bash
# Server only
npm run dev:server

# Client only
npm run dev:client
```

---

## 🔐 Authentication

| Feature | Details |
|---------|---------|
| Login | `POST /api/auth/login` |
| Signup | `POST /api/auth/signup` |
| JWT Token | Stored in `localStorage`, 7-day expiry |
| Protected | Store only accessible after sign-in |

### Demo Account
```
Email:    alexander.vance@lumina-tech.com
Password: Password123!
```

---

## 🗄️ Database

- **MongoDB** (if running locally at `mongodb://127.0.0.1:27017/lumina_ecommerce`)
- **Auto-fallback** to a resilient embedded file store if MongoDB is offline
- Set `MONGODB_URI` in `.env` for MongoDB Atlas

---

## ✨ Features

- 🔐 Login / Signup with JWT authentication
- 🏠 Premium landing page with animated hero
- 🛍️ Product catalog with filtering, search & sorting
- 🛒 Persistent cart (localStorage)
- 💳 Checkout flow with promo codes (try **LUMINA20**)
- 📦 Order history
- ➕ Admin: add products
- 📊 Live DB status indicator in navbar

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Vanilla CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose (with embedded fallback) |
| Auth | bcryptjs + jsonwebtoken (JWT) |
| Icons | Lucide React |
| Fonts | Inter, Outfit (Google Fonts) |
