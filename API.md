# 📘 SmartCart AI — REST API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 🔐 Authentication Endpoints (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user & issue verification token |
| `POST` | `/auth/login` | Public | Login with email & password (includes brute-force lockout) |
| `POST` | `/auth/verify-email` | Public | Verify email using token |
| `POST` | `/auth/forgot-password` | Public | Send password reset link to user email |
| `POST` | `/auth/reset-password` | Public | Reset password using reset token |
| `POST` | `/auth/refresh-token` | Public | Refresh short-lived Access Token |
| `POST` | `/auth/logout` | Public | Revoke tokens & clear HTTP-Only cookies |
| `GET`  | `/auth/me` | Private | Get current authenticated user profile |

---

## 🛍️ Product Endpoints (`/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`  | `/products` | Public | Get paginated products (filters: category, brand, q, minPrice, maxPrice, sort, page, limit) |
| `GET`  | `/products/:id` | Public | Get product details & customer reviews |
| `POST` | `/products` | Admin | Create new product (with Cloudinary image upload) |
| `PUT`  | `/products/:id` | Admin | Update product details |
| `DELETE`| `/products/:id` | Admin | Delete product |
| `POST` | `/products/:id/reviews` | Private | Post product review & rating |

---

## 💳 Payment & Order Endpoints (`/payment` & `/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/orders` | Private | Create new order with idempotency protection |
| `GET`  | `/orders/myorders` | Private | Get logged-in user order history |
| `GET`  | `/orders/:id` | Private | Get single order tracking details |
| `POST` | `/orders/:id/cancel` | Private | Cancel order before shipment |
| `POST` | `/payment/create-order` | Private | Create Razorpay payment order |
| `POST` | `/payment/verify` | Private | Verify Razorpay HMAC SHA256 payment signature |
| `POST` | `/payment/webhook` | Public | Razorpay webhook event listener |

---

## 🤖 Google Gemini AI Endpoints (`/ai`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | Public | AI Shopping Assistant conversational chat |
| `POST` | `/ai/generate-description` | Admin | AI Product Description & SEO generator |
| `GET`  | `/ai/summary/:productId` | Public | AI Review sentiment summarizer |
| `GET`  | `/ai/search` | Public | AI Smart natural language product search |

---

## 📊 Analytics & Coupon Endpoints (`/analytics` & `/coupons`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`  | `/analytics/dashboard` | Admin | Get revenue, order stats, low stock alerts & sales graph |
| `POST` | `/coupons/validate` | Private | Validate coupon code & calculate discount |
| `GET`  | `/coupons` | Admin | List all store coupons |
| `POST` | `/coupons` | Admin | Create store coupon |
| `DELETE`| `/coupons/:id` | Admin | Delete coupon |
