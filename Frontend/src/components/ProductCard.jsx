import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, showAddButton = true }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const defaultSize = product.sizes[0]
  const isWishlisted = isInWishlist(product.id)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id, defaultSize, 1)
  }

  function handleWishlistToggle(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <article>
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark rounded-xl">
          {product.tag && (
            <span className="absolute top-3 left-3 z-10 bg-cream px-2.5 py-1 text-[10px] font-medium tracking-wider text-ink uppercase rounded-sm shadow-sm">
              {product.tag}
            </span>
          )}
          
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label="Wishlist toggle"
            className="absolute top-3 right-3 z-10 rounded-full bg-cream/90 p-2 text-ink shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-cream"
          >
            <Heart
              className={`h-4 w-4 transition ${
                isWishlisted ? 'fill-terracotta text-terracotta' : 'text-ink/70'
              }`}
            />
          </button>

          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(product.name, product.category)
            }}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          {showAddButton && (
            <button
              type="button"
              onClick={handleAdd}
              className="absolute inset-x-3 bottom-3 translate-y-2 bg-cream py-3 text-[12px] font-medium tracking-wide opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-cream rounded-lg shadow-sm"
            >
              Add to bag
            </button>
          )}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-medium">{product.name}</h3>
          <p className="text-sm text-ink-muted">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-xs capitalize tracking-wide text-ink-muted/80">
          {product.category}
        </p>
      </article>
    </Link>
  )
}
