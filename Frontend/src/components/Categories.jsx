import { Link } from 'react-router-dom'
import { categoryImages, getPlaceholderImage } from '../data/products'

const categories = [
  { name: 'Outerwear', slug: 'outerwear', count: '24 pieces' },
  { name: 'Knitwear', slug: 'knitwear', count: '18 pieces' },
  { name: 'Leather', slug: 'leather', count: '12 pieces' },
  { name: 'Objects', slug: 'objects', count: '09 pieces' },
]

export default function Categories() {
  return (
    <section id="women" className="border-t border-ink/5 bg-cream-dark/40 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
              Shop by category
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
              The quiet wardrobe
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
            Four collections, one season — cut small, finished by hand, made to last.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/products?category=${cat.slug}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-cream rounded-xl">
                <img
                  src={categoryImages[cat.slug]}
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(cat.name, cat.slug)
                  }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-display text-xl font-medium">{cat.name}</h3>
                <span className="text-xs tracking-wide text-ink-muted">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
