import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, Sparkles } from 'lucide-react'
import { searchProducts as staticSearchProducts, formatPrice, getPlaceholderImage } from '../data/products'
import { api } from '../services/api'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [liveResults, setLiveResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    async function searchLive() {
      if (!query.trim()) {
        setLiveResults(staticSearchProducts(''))
        return
      }
      try {
        const res = await api.getProducts(`?q=${encodeURIComponent(query.trim())}`)
        if (res && res.products) {
          const normalized = res.products.map((p) => ({
            ...p,
            id: p._id || p.id,
          }))
          setLiveResults(normalized)
        } else {
          setLiveResults(staticSearchProducts(query))
        }
      } catch {
        setLiveResults(staticSearchProducts(query))
      }
    }

    const timer = setTimeout(searchLive, 200)
    return () => clearTimeout(timer)
  }, [query])

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
      <div className="w-full max-w-xl bg-cream shadow-2xl rounded-2xl overflow-hidden border border-ink/10">
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-4 bg-cream-dark/30">
          <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goToProducts()}
            placeholder="Search live coats, knitwear, leather accessories..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted/60"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full p-1 text-ink-muted hover:bg-cream-dark"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Live Search Results Container - Scrollable without 6 item limit */}
        <div className="max-h-[60vh] overflow-y-auto">
          {liveResults.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-ink-muted">
              <p className="font-display text-lg">No matching pieces found</p>
              <p className="text-xs text-ink-muted mt-1">Try searching for "coat", "cashmere", or "leather"</p>
            </div>
          ) : (
            <ul>
              {liveResults.map((product) => (
                <li key={product.id || product._id}>
                  <Link
                    to={`/products/${product.id || product._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 border-b border-ink/5 px-4 py-3.5 transition hover:bg-cream-dark/60"
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
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-base font-medium">{product.name}</p>
                        {product.tag && (
                          <span className="rounded bg-terracotta/10 px-1.5 py-0.5 text-[9px] font-semibold text-terracotta uppercase">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs capitalize text-ink-muted">{product.category}</p>
                    </div>
                    <span className="text-sm font-medium text-ink">{formatPrice(product.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-ink/10 px-4 py-3 bg-cream-dark/20 text-center">
          <button
            type="button"
            onClick={goToProducts}
            className="w-full py-2 text-[13px] font-medium tracking-wide text-terracotta transition hover:underline"
          >
            {query.trim() ? `View all ${liveResults.length} results for “${query.trim()}”` : 'Browse full catalog'}
          </button>
        </div>
      </div>
    </div>
  )
}
