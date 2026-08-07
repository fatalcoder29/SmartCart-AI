import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { products, formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id))

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        <header className="mb-12 text-center">
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Saved favorites</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">Your wishlist</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {wishlistProducts.length === 0
              ? 'Your wishlist is currently empty.'
              : `${wishlistProducts.length} ${wishlistProducts.length === 1 ? 'piece' : 'pieces'} saved for later`}
          </p>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-cream p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark">
              <Heart className="h-7 w-7 text-ink-muted/50" strokeWidth={1.25} />
            </div>
            <h2 className="mt-5 font-display text-xl font-medium">No saved items yet</h2>
            <p className="mt-2 text-sm text-ink-muted">Click the heart icon on any product to save it to your personal wishlist.</p>
            <Link to="/products" className="btn-primary mt-7 inline-flex rounded-full">Explore collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cream p-4 transition hover:shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream-dark">
                  <img src={product.image} alt={product.name} onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name, product.category) }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <button type="button" onClick={() => removeFromWishlist(product.id)} aria-label="Remove from wishlist" className="absolute top-3 right-3 rounded-full bg-cream/90 p-2 text-ink/70 shadow-sm backdrop-blur-sm transition hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{formatPrice(product.price)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => addToCart(product.id, product.sizes?.[0] || 'M', 1)} className="btn-primary flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs">
                      <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Add to bag
                    </button>
                    <Link to={`/products/${product.id}`} className="btn-outline rounded-full px-4 py-2.5 text-xs">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
