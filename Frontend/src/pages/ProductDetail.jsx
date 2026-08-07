import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Heart, ShoppingBag, Star } from 'lucide-react'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { getProductById, products as staticProducts, formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { api } from '../services/api'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await api.getProductById(id)
        if (res?.product) {
          const p = { ...res.product, id: res.product._id || id }
          setProduct(p)
          setSize(p.sizes?.[0] ?? 'M')
          const catRes = await api.getProducts(`?category=${p.category}`)
          if (catRes?.products) {
            setRelated(
              catRes.products
                .filter((r) => (r._id || r.id) !== id)
                .slice(0, 4)
                .map((r) => ({ ...r, id: r._id || r.id }))
            )
          }
        }
      } catch {
        const p = getProductById(id)
        if (p) {
          setProduct(p)
          setSize(p.sizes?.[0] ?? 'M')
          setRelated(staticProducts.filter((r) => r.category === p.category && r.id !== id).slice(0, 4))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="skeleton aspect-[3/4] w-full rounded-2xl" />
            <div className="flex flex-col justify-center space-y-5">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-10 w-3/4" />
              <div className="skeleton h-8 w-20" />
              <div className="skeleton h-20 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-5 py-24 text-center">
          <p className="font-display text-2xl">Product not found</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex rounded-full">Back to shop</Link>
        </div>
      </Layout>
    )
  }

  const isWishlisted = isInWishlist(product.id || product._id)
  const sizes = product.sizes?.length ? product.sizes : ['S', 'M', 'L']

  function handleAdd() {
    addToCart(product.id || product._id, size || sizes[0], qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-12 md:px-8 lg:px-10">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-terracotta">
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl bg-cream-dark">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name, product.category) }}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">{product.category}</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-2xl font-medium text-terracotta">{formatPrice(product.price)}</p>

            {product.rating && (
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'fill-terracotta text-terracotta' : 'text-ink/20'}`} />
                ))}
                <span className="ml-1 text-xs text-ink-muted">{product.rating}</span>
              </div>
            )}

            <p className="mt-5 text-sm leading-relaxed text-ink-muted">{product.description}</p>

            <div className="mt-8">
              <p className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      size === s
                        ? 'border-ink bg-ink text-cream'
                        : 'border-ink/15 text-ink hover:border-terracotta'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Quantity</p>
              <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg border border-ink/15">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-ink-muted transition hover:bg-cream-dark hover:text-ink">−</button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium">{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-2 text-ink-muted transition hover:bg-cream-dark hover:text-ink">+</button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleAdd} className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-full py-3.5">
                {added ? (<><Check className="h-4 w-4" /> Added to bag</>) : (<><ShoppingBag className="h-4 w-4" strokeWidth={1.75} /> Add to bag</>)}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id || product._id)}
                className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-[13px] font-medium transition ${
                  isWishlisted
                    ? 'border-terracotta bg-terracotta/5 text-terracotta'
                    : 'border-ink/15 text-ink hover:border-terracotta hover:text-terracotta'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-terracotta' : ''}`} />
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            {product.details && product.details.length > 0 && (
              <ul className="mt-10 space-y-2.5 border-t border-ink/10 pt-8">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-12 sm:mt-20 sm:pt-16">
            <h2 className="font-display text-2xl font-medium md:text-3xl">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
