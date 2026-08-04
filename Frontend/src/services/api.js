const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000/api/v1'

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await res.json()

    if (!res.ok) {
      // If token expired, attempt silent token refresh once
      if (res.status === 401 && data.message?.includes('expired') && !options._retry) {
        options._retry = true
        try {
          await api.refreshToken()
          return request(endpoint, options)
        } catch {
          // Refresh failed
        }
      }
      throw new Error(data.message || 'API request failed')
    }
    return data
  } catch (error) {
    console.warn(`[API Notice] Request to ${endpoint} failed:`, error.message)
    throw error
  }
}

export const api = {
  // Health Check
  checkHealth: () => request('/health'),

  // Auth APIs
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getProfile: () => request('/auth/me'),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: () => request('/auth/refresh-token', { method: 'POST' }),

  // Product APIs
  getProducts: (params = '') => request(`/products${params}`),
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (productData) => request('/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  createReview: (id, reviewData) => request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) }),

  // Order APIs
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/myorders'),
  getOrderById: (id) => request(`/orders/${id}`),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Payment APIs (Razorpay)
  createPaymentOrder: (orderId) => request('/payment/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verifyPayment: (paymentData) => request('/payment/verify', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Coupon APIs
  validateCoupon: (code, cartTotal) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, cartTotal }) }),
  getCoupons: () => request('/coupons'),
  createCoupon: (couponData) => request('/coupons', { method: 'POST', body: JSON.stringify(couponData) }),
  deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),

  // AI APIs (Google Gemini)
  aiChat: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  aiGenerateDescription: (productName, category) => request('/ai/generate-description', { method: 'POST', body: JSON.stringify({ productName, category }) }),
  aiSummarizeReviews: (productId) => request(`/ai/summary/${productId}`),
  aiSmartSearch: (q) => request(`/ai/search?q=${encodeURIComponent(q)}`),

  // Admin Analytics API
  getDashboardAnalytics: () => request('/analytics/dashboard'),
}
