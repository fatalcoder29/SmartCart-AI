import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getProductById } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'maren_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(productId, size, quantity = 1) {
    setItems((prev) => {
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
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) {
      removeFromCart(key)
      return
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const cartItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId)
          if (!product) return null
          return { ...item, product, lineTotal: product.price * item.quantity }
        })
        .filter(Boolean),
    [items],
  )

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.lineTotal, 0),
    [cartItems],
  )

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
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
