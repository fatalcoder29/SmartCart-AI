# SmartCart AI — Production Checklist

Use this before deploying to production.

---

## 1. Environment Variables

### Backend (`Backend/.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `PORT` | Yes | Usually `5000` |
| `NODE_ENV` | Yes | Set to `production` |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Long random string (32+ chars) |
| `JWT_REFRESH_SECRET` | Yes | Different from JWT_SECRET |
| `CORS_ORIGIN` | Yes | Frontend URL(s), comma-separated |
| `GEMINI_API_KEY` | Yes | From Google AI Studio |
| `RAZORPAY_KEY_ID` | Yes | Live key for production |
| `RAZORPAY_KEY_SECRET` | Yes | Live secret |
| `CLOUDINARY_CLOUD_NAME` | Optional | For image uploads |
| `CLOUDINARY_API_KEY` | Optional | |
| `CLOUDINARY_API_SECRET` | Optional | |
| `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` | Optional | For verification & reset emails |

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=https://your-backend-url.com/api/v1
```

---

## 2. Security

- [ ] Rotate all JWT secrets (never use example values)
- [ ] Use **live** Razorpay keys only in production
- [ ] Confirm `CORS_ORIGIN` matches your real frontend domain(s)
- [ ] Ensure cookies use `secure: true` and `sameSite: 'none'` in production (already handled when `NODE_ENV=production`)
- [ ] Rate limits are active (200/15m API, 20/15m auth)
- [ ] Never commit `.env` files (already in `.gitignore`)

---

## 3. Database

- [ ] MongoDB Atlas IP whitelist includes your server / `0.0.0.0/0` if needed
- [ ] Run seed if needed: `cd Backend && npm run seed`
- [ ] Create at least one admin user (`role: 'admin'`)
- [ ] Indexes exist on Product.slug, User.email (Mongoose handles most)

---

## 4. Build & Deploy

### Backend (Render / Railway / VPS)

```bash
cd Backend
npm install --production
npm start
```

Or use `render.yaml` already in the repo.

### Frontend (Vercel / Netlify)

```bash
cd Frontend
npm install
npm run build
# Deploy the `dist/` folder
```

- [ ] Set `VITE_API_URL` in the host’s environment settings
- [ ] Confirm SPA rewrites (all routes → `index.html`) — `vercel.json` is included

---

## 5. Smoke Tests After Deploy

- [ ] `GET /api/v1/health` returns `success: true`
- [ ] Register + login works
- [ ] Products page loads (API or static fallback)
- [ ] Add to cart → checkout flow opens Razorpay
- [ ] Admin route only accessible for `role === 'admin'`
- [ ] AI chat responds (or shows graceful fallback)
- [ ] Password reset email sends (if email configured)

---

## 6. Performance & UX

- [ ] Frontend production build succeeds with no errors
- [ ] Images load (Unsplash / Cloudinary / placeholders)
- [ ] Mobile menu + sticky cart summary work on small screens
- [ ] Loading skeletons appear while data fetches

---

## 7. Optional Polish

- [ ] Custom domain + HTTPS
- [ ] Error monitoring (e.g. Sentry)
- [ ] Analytics (Plausible / GA4)
- [ ] Real product images via Cloudinary admin upload

---

When all boxes are checked, the app is ready for a production launch.
