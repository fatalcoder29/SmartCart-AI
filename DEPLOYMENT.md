# 🚀 Production Deployment Guide

---

## 1. 🌐 Frontend Deployment (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `Frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   ```env
   VITE_API_URL=https://smartcart-ai-backend.onrender.com/api/v1
   ```
6. Deploy! Vercel will automatically use [vercel.json](file:///d:/AI-Ecommerce/Frontend/vercel.json) for SPA client routing.

---

## 2. ⚡ Backend Deployment (Render)

1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service** targeting the `Backend` folder.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables in Render Dashboard:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://burningishu_db_user:ZzO95l8sw6Ygjyw5@commerce-ai.bghxf5i.mongodb.net/ai_ecommerce?retryWrites=true&w=majority&appName=commerce-ai
   JWT_SECRET=your_super_secure_jwt_secret_key_2026
   JWT_REFRESH_SECRET=your_super_secure_refresh_token_secret_2026
   CORS_ORIGIN=https://smartcart-ai.vercel.app
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
6. Deploy! Render will use [render.yaml](file:///d:/AI-Ecommerce/Backend/render.yaml).

---

## 3. 🗄️ Database (MongoDB Atlas)

1. Open **[MongoDB Atlas Dashboard](https://cloud.mongodb.com)**.
2. Go to **Security → Network Access**.
3. Add IP `0.0.0.0/0` (Allow Access From Anywhere) to allow Render server access.
