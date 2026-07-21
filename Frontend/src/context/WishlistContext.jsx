import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'maren_wishlist'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      if (saved) setWishlist(JSON.parse(saved))
    } catch {
      localStorage.removeItem(WISHLIST_KEY)
    }
  }, [])

  function saveWishlist(items) {
    setWishlist(items)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }

  function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
      saveWishlist(wishlist.filter((id) => id !== productId))
    } else {
      saveWishlist([...wishlist, productId])
    }
  }

  function isInWishlist(productId) {
    return wishlist.includes(productId)
  }

  function removeFromWishlist(productId) {
    saveWishlist(wishlist.filter((id) => id !== productId))
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
