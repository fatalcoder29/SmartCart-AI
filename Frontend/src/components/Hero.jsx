import { Link } from 'react-router-dom'
import { getPlaceholderImage } from '../data/products'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-20">
      <div className="lg:col-span-7">
        <div className="animate-fade-up flex items-center gap-3">
          <span className="h-px w-8 bg-ink/30" />
          <p className="text-[11px] font-medium tracking-[0.28em] text-ink-muted uppercase">
            Autumn Edit / Vol. 14
          </p>
        </div>

        <h1 className="animate-fade-up delay-1 mt-6 max-w-xl font-display text-[2.75rem] leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          Clothes that{' '}
          <em className="font-display text-terracotta italic">outlast</em> the season.
        </h1>

        <p className="animate-fade-up delay-2 mt-7 max-w-md text-[15px] leading-relaxed font-light text-ink-muted md:text-base">
          A quiet wardrobe of tailored coats, weightless cashmere and leather goods, cut in
          small runs from natural fibres — designed to be worn for a decade, not a summer.
        </p>

        <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-4">
          <Link
            to="/products"
            className="bg-ink px-7 py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta"
          >
            Shop the edit
          </Link>
          <a
            href="#journal"
            className="border border-ink/20 px-7 py-3.5 text-[13px] font-medium tracking-wide text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            Read the journal
          </a>
        </div>
      </div>

      <div className="animate-fade-in delay-2 lg:col-span-5">
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark shadow-xl rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80"
            alt="Oslo wool coat"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage('Oslo Wool Coat', 'Outerwear')
            }}
            className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
          />
        </div>
      </div>
    </section>
  )
}
