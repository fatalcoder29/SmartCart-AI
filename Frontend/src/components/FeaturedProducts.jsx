import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { products } from '../data/products'

const featured = products.slice(0, 4)

export default function FeaturedProducts() {
  return (
    <section id="new-arrivals" className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
              Featured
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
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

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
