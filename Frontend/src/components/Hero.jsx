import { Link } from 'react-router-dom'
import { getPlaceholderImage } from '../data/products'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-20">
      <div className="lg:col-span-7">
        <div className="animate-fade-up flex items-center gap-3">
          <span className="h-px w-8 bg-ink/30" />
          <p className="text-[11px] font-medium tracking-[0.28em] text-ink-muted uppercase">
            Autumn Edit / Vol. 14
          </p>
        </div>

        <h1 className="animate-fade-up delay-1 mt-5 max-w-xl font-display text-[2.25rem] leading-[1.1] font-medium tracking-tight text-ink sm:mt-6 sm:text-[2.75rem] md:text-5xl lg:text-6xl xl:text-[4.25rem]">
          Clothes that{' '}
          <em className="font-display text-terracotta italic">outlast</em> the season.
        </h1>

        <p className="animate-fade-up delay-2 mt-5 max-w-md text-sm leading-relaxed font-light text-ink-muted sm:mt-7 sm:text-[15px] md:text-base">
          A quiet wardrobe of tailored coats, weightless cashmere and leather goods, cut in
          small runs from natural fibres — designed to be worn for a decade, not a summer.
        </p>

        <div className="animate-fade-up delay-3 mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
          <Link to="/products" className="btn-primary rounded-sm">
            Shop the edit
          </Link>
          <a href="#journal" className="btn-outline rounded-sm">
            Read the journal
          </a>
        </div>
      </div>

      <div className="animate-fade-in delay-2 order-first lg:order-none lg:col-span-5">
        <div className="relative mx-auto aspect-[3/4] max-h-[50vh] overflow-hidden rounded-2xl bg-cream-dark shadow-xl sm:max-h-[60vh] lg:max-h-none">
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
