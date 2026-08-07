import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getProductById as getStaticProductById } from '../data/products'
import { api } from '../services/api'

const CartContext = createContext(null)
const STORAGE_KEY = 'maren_cart'

// In-memory cache for API-fetched products (avoids repeated fetches)
const productCache = new Map()

async function resolveProduct(productId) {
  if (productCache.has(productId)) return productCache.get(productId)

  // First try static data (instant — covers all seeded products)
  const staticProduct = getStaticProductById(productId)
  if (staticProduct) {
    productCache.set(productId, staticProduct)
    return staticProduct
  }

  // Fallback: fetch from live API (for admin-created MongoDB products)
  try {
    const res = await api.getProductById(productId)
    if (res && res.product) {
      const p = { ...res.product, id: res.product._id }
      productCache.set(productId, p)
      return p
    }
  } catch {
    // API not available or invalid ID — return null
  }

  return null
}

export function CartProvider({ children }) {
  const [rawItems, setRawItems] = useState([])
  const [resolvedItems, setResolvedItems] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setRawItems(JSON.parse(saved))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawItems))
  }, [rawItems])

  useEffect(() => {
    let cancelled = false

    async function resolveAll() {
      const resolved = await Promise.all(
        rawItems.map(async (item) => {
          const product = await resolveProduct(item.productId)
          if (!product) return null
          return { ...item, product, lineTotal: product.price * item.quantity }
        })
      )
      if (!cancelled) {
        setResolvedItems(resolved.filter(Boolean))
      }
    }

    resolveAll()
    return () => { cancelled = true }
  }, [rawItems])

  function addToCart(productId, size, quantity = 1) {
    setRawItems((prev) => {
      const key = `${productId}__${size}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { key, productId, size, quantity }]
    })
  }

  function removeFromCart(key) {
    setRawItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) {
      removeFromCart(key)
      return
    }
    setRawItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setRawItems([])
    setResolvedItems([])
    productCache.clear()
  }

  const cartCount = useMemo(
    () => rawItems.reduce((sum, i) => sum + i.quantity, 0),
    [rawItems],
  )

  const subtotal = useMemo(
    () => resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0),
    [resolvedItems],
  )

  return (
    <CartContext.Provider
      value={{
        items: resolvedItems,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
