import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { products } from '../data/products'

const featured = products.slice(0, 4)

export default function FeaturedProducts() {
  return (
    <section id="new-arrivals" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
              Featured
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
              New arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="text-[13px] font-medium tracking-wide text-ink underline decoration-ink/20 underline-offset-4 transition hover:text-terracotta hover:decoration-terracotta"
          >
            View all pieces
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
