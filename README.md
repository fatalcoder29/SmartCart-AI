# 🛍️ SmartCart AI — Production Full-Stack MERN E-Commerce Platform

SmartCart AI is a state-of-the-art luxury e-commerce platform built with the MERN stack (MongoDB, Express.js, React 19, Node.js), powered by **Google Gemini 1.5 Flash AI** and **Razorpay Payments**.

---

## ✨ Core Features

### 🔐 Advanced Security & Authentication (Module 2 & 10)
- **Dual Token Rotation**: Short-lived Access Tokens (15m) + Long-lived Refresh Tokens (7d) in HTTP-Only cookies.
- **Brute-Force Lockout**: 5 failed login attempts lock account for 30 minutes.
- **Email Verification & Password Recovery**: Token-based email verification, forgot password, and reset password flows.
- **Security Middlewares**: Helmet HTTP security headers, Rate Limiting (200 req/15m API, 20 req/15m Auth), NoSQL Injection sanitization (`express-mongo-sanitize`), HPP parameter pollution prevention, and Gzip compression.

### 🛍️ Product Catalog & Reviews (Module 3)
- **Rich Schema**: Brand, SKU, Slug auto-generation, Ratings, SEO fields, multiple images, discount percent calculation.
- **Product Reviews**: Verified buyer review submissions with automatic rating average recalculation.
- **Pagination & Filters**: Server-side pagination (`page`, `limit`), brand filtering, price range, and sorting.

### 💳 Razorpay Payments & Orders (Module 6 & 7)
- **Razorpay Test Mode**: HMAC SHA256 payment signature verification and webhook integration.
- **Strict Price Protection**: Total order price is strictly computed on the backend.
- **Idempotency & Stock Deduction**: Prevents duplicate order creation and deducts inventory stock transactionally upon verified payment.

### 🤖 Google Gemini AI Integration (Module 9)
- **AI Shopping Assistant**: Conversational stylist widget powered by Google Gemini 1.5 Flash model.
- **AI Product Description Generator**: Automated high-converting product descriptions & SEO tags for admins.
- **AI Review Summarizer**: Summarizes customer sentiment from reviews.
- **AI Smart Search**: Natural language query processing into category & keyword filters.

### 📊 Admin Analytics & Coupons (Module 4, 5, 8)
- **Analytics Dashboard**: Live revenue totals, order status counts, low-stock alerts, and monthly sales data.
- **Store Coupons**: Discount percentage and fixed amount coupons with minimum purchase validation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7 |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Nodemailer |
| **Database** | MongoDB Atlas / Local MongoDB |
| **AI Engine** | Google Gemini 1.5 Flash API (`@google/generative-ai`) |
| **Payments** | Razorpay SDK (Test Mode) |
| **Media Hosting** | Cloudinary v2 SDK |

---

## 🚀 Quick Setup & Run

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/fatalcoder29/SmartCart-AI.git
cd SmartCart-AI

# Install Backend packages
cd Backend
npm install

# Install Frontend packages
cd ../Frontend
npm install
```

### 2. Environment Variables

Create `.env` inside `Backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://burningishu_db_user:ZzO95l8sw6Ygjyw5@commerce-ai.bghxf5i.mongodb.net/ai_ecommerce?retryWrites=true&w=majority&appName=commerce-ai

JWT_SECRET=maren_ai_ecommerce_jwt_secret_key_2026_super_secure
JWT_REFRESH_SECRET=maren_ai_ecommerce_jwt_refresh_secret_key_2026

CORS_ORIGIN=http://localhost:5173

RAZORPAY_KEY_ID=rzp_test_dummy_key_id
RAZORPAY_KEY_SECRET=dummy_key_secret

GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Servers

**Backend:**
```bash
cd Backend
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 📜 Documentation Links

- 📘 [API Reference Manual](API.md)
- 📐 [Architecture Diagram & System Flow](ARCHITECTURE.md)
- 🚀 [Production Deployment Guide](DEPLOYMENT.md)
