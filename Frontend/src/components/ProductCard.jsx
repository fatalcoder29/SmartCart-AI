import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, showAddButton = true }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const defaultSize = product.sizes?.[0] || 'M'
  const isWishlisted = isInWishlist(product.id)
  const hasDiscount = product.discountPercent > 0 || (product.originalPrice && product.originalPrice > product.price)

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
      <article className="relative">
        <div className="product-shine relative aspect-[3/4] overflow-hidden bg-cream-dark rounded-xl">
          {product.tag && (
            <span className="absolute top-3 left-3 z-10 bg-cream px-2.5 py-1 text-[10px] font-medium tracking-wider text-ink uppercase rounded-sm shadow-sm">
              {product.tag}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 left-3 z-10 bg-terracotta px-2.5 py-1 text-[10px] font-medium tracking-wider text-cream uppercase rounded-sm shadow-sm">
              Sale
            </span>
          )}
          <button type="button" onClick={handleWishlistToggle} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} className="absolute top-3 right-3 z-10 rounded-full bg-cream/90 p-2 text-ink shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-cream">
            <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-terracotta text-terracotta' : 'text-ink/70'}`} />
          </button>
          <img src={product.image || product.images?.[0]} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name, product.category) }} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          {showAddButton && (
            <button type="button" onClick={handleAdd} className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 rounded-lg bg-cream py-2.5 text-[11px] font-medium tracking-wide shadow-md transition-all duration-300 sm:inset-x-3 sm:bottom-3 sm:translate-y-3 sm:py-3 sm:text-[12px] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 hover:bg-ink hover:text-cream">
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Add to bag</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:items-baseline sm:gap-3">
          <h3 className="font-display text-sm font-medium leading-snug transition-colors group-hover:text-terracotta sm:text-base md:text-lg">{product.name}</h3>
          <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
            {hasDiscount && product.originalPrice && (<span className="text-[10px] text-ink-muted line-through sm:text-xs">{formatPrice(product.originalPrice)}</span>)}
            <p className={`text-xs font-medium sm:text-sm ${hasDiscount ? 'text-terracotta' : 'text-ink-muted'}`}>{formatPrice(product.price)}</p>
          </div>
        </div>
        <p className="mt-0.5 text-[10px] capitalize tracking-wide text-ink-muted/80 sm:mt-1 sm:text-xs">{product.category}</p>
      </article>
    </Link>
  )
}
