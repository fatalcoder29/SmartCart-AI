import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { categories, products as staticProducts, getProductsByCategory, searchProducts } from '../data/products'
import { api } from '../services/api'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const query = searchParams.get('q') || ''
  const [liveProducts, setLiveProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveProducts() {
      setLoading(true)
      try {
        let params = '?'
        if (category !== 'all') params += `category=${category}&`
        if (query.trim()) params += `q=${encodeURIComponent(query.trim())}&`

        const res = await api.getProducts(params)
        if (res && res.products) {
          // Normalize _id to id for frontend compatibility
          const normalized = res.products.map((p) => ({
            ...p,
            id: p._id || p.id,
            sizes: p.sizes && p.sizes.length ? p.sizes : ['S', 'M', 'L'],
          }))
          setLiveProducts(normalized)
        }
      } catch (err) {
        console.warn('Backend API offline or database connecting. Using fallback products dataset.')
        setLiveProducts(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveProducts()
  }, [category, query])

  // Fallback calculation if backend isn't returning data
  const displayedProducts = liveProducts !== null ? liveProducts : (() => {
    let list = getProductsByCategory(category)
    if (query.trim()) {
      const ids = new Set(searchProducts(query).map((p) => p.id))
      list = list.filter((p) => ids.has(p.id))
    }
    return list
  })()

  function setCategory(id) {
    const next = new URLSearchParams(searchParams)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setSearchParams(next)
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
          Shop Catalog
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-5xl">
          {query.trim() ? `Results for “${query.trim()}”` : 'All pieces'}
        </h1>
        <p className="mt-3 max-w-lg text-sm text-ink-muted">
          {displayedProducts.length} {displayedProducts.length === 1 ? 'piece' : 'pieces'} — tailored coats,
          knitwear, leather goods and objects.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 text-[12px] font-medium tracking-wide transition rounded-full ${
                category === cat.id
                  ? 'bg-ink text-cream'
                  : 'border border-ink/15 text-ink/80 hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {displayedProducts.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-display text-2xl">No pieces found</p>
            <p className="mt-2 text-sm text-ink-muted">Try a different category or search term.</p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-ink px-6 py-3 text-[13px] font-medium text-cream transition hover:bg-terracotta rounded-full"
            >
              View all products
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
