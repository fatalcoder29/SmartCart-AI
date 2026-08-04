import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { getProductById, products as staticProducts, formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await api.getProductById(id)
        if (res?.product) {
          const p = { ...res.product, id: res.product._id || id }
          setProduct(p)
          setSize(p.sizes?.[0] ?? 'M')
          // Fetch related products from same category
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
        // Fallback to static data
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
        <div className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
          <p className="text-ink-muted animate-pulse">Loading product…</p>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
          <h1 className="font-display text-3xl">Product not found</h1>
          <Link to="/products" className="mt-6 inline-block text-terracotta underline underline-offset-4">
            Back to shop
          </Link>
        </div>
      </Layout>
    )
  }

  function handleAdd() {
    addToCart(product.id || product._id, size, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:px-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted transition hover:text-terracotta"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[3/4] overflow-hidden bg-cream-dark rounded-2xl shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = getPlaceholderImage(product.name, product.category)
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.tag && (
              <span className="mb-3 w-fit bg-cream-dark px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase">
                {product.tag}
              </span>
            )}
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl text-ink-muted">{formatPrice(product.price)}</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-muted">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(product.sizes || ['S', 'M', 'L']).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] border px-4 py-2.5 text-[13px] font-medium transition ${
                      size === s
                        ? 'border-ink bg-ink text-cream'
                        : 'border-ink/15 hover:border-terracotta'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-8 flex w-full items-center justify-center gap-2 bg-ink py-4 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta sm:w-auto sm:px-12"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to bag
                </>
              ) : (
                'Add to bag'
              )}
            </button>

            {product.details && product.details.length > 0 && (
              <ul className="mt-10 space-y-2 border-t border-ink/10 pt-8">
                {product.details.map((detail) => (
                  <li key={detail} className="text-sm text-ink-muted">
                    · {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-ink/10 pt-16">
            <h2 className="font-display text-2xl font-medium md:text-3xl">You may also like</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
