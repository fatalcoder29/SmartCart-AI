import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchProducts, formatPrice, getPlaceholderImage } from '../data/products'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const results = searchProducts(query)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function goToProducts() {
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 px-4 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-cream shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-4">
          <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goToProducts()}
            placeholder="Search coats, knitwear, leather…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted/50"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">No pieces found.</p>
          ) : (
            <ul>
              {results.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 border-b border-ink/5 px-4 py-3 transition hover:bg-cream-dark/60"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(product.name, product.category)
                      }}
                      className="h-14 w-11 shrink-0 object-cover bg-cream-dark rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-medium">{product.name}</p>
                      <p className="text-xs capitalize text-ink-muted">{product.category}</p>
                    </div>
                    <span className="text-sm text-ink-muted">{formatPrice(product.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-ink/10 px-4 py-3">
          <button
            type="button"
            onClick={goToProducts}
            className="w-full py-2.5 text-[13px] font-medium tracking-wide text-terracotta transition hover:text-terracotta-deep"
          >
            {query.trim() ? `View all results for “${query.trim()}”` : 'Browse all products'}
          </button>
        </div>
      </div>
    </div>
  )
}
