import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { products, formatPrice } from '../data/products'
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
        <header className="mb-10 text-center">
          <span className="text-[11px] font-semibold tracking-widest text-terracotta uppercase">
            Saved Favorites
          </span>
          <h1 className="font-display mt-2 text-3xl md:text-4xl">Your Wishlist</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {wishlistProducts.length === 0
              ? 'Your wishlist is currently empty.'
              : `${wishlistProducts.length} items saved for later`}
          </p>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-cream/50 p-8 text-center backdrop-blur-sm">
            <Heart className="mx-auto h-12 w-12 text-ink-muted/40" strokeWidth={1} />
            <h2 className="font-display mt-4 text-xl">No saved items yet</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Click the heart icon on any product to save it to your personal wishlist.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-xs font-medium text-cream transition hover:bg-terracotta"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-ink/5 bg-cream/50 p-4 transition hover:shadow-md"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cream-dark">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 rounded-full bg-cream/90 p-2 text-ink/70 shadow-sm backdrop-blur-sm transition hover:bg-terracotta hover:text-cream"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{formatPrice(product.price)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(product.id, product.sizes[0], 1)}
                      className="flex-1 rounded-full bg-ink py-2.5 text-xs font-medium text-cream transition hover:bg-terracotta"
                    >
                      Add to Bag
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      className="rounded-full border border-ink/10 px-4 py-2.5 text-xs font-medium text-ink transition hover:border-ink"
                    >
                      View
                    </Link>
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
