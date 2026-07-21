import { getPlaceholderImage } from '../data/products'

export default function Editorial() {
  return (
    <section id="journal" className="border-t border-ink/5 bg-cream-dark/50">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458e5e?auto=format&fit=crop&w=1000&q=80"
            alt="Atelier — tailoring tools and fabric"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage('Atelier Journal', 'Oslo Studio')
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-5 py-14 md:px-12 lg:px-16 lg:py-20">
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
            From the journal
          </p>
          <h2 className="mt-4 max-w-md font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl lg:text-[2.75rem]">
            Why we cut in small runs — and never chase trends.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed font-light text-ink-muted">
            Each piece starts on a cutting table in Oslo. We produce fewer units, finish by
            hand, and keep fabrics we can stand behind for years — not seasons.
          </p>
          <a
            href="#journal"
            className="mt-8 inline-flex w-fit items-center gap-2 text-[13px] font-medium tracking-wide text-ink transition hover:text-terracotta"
          >
            Read the essay
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
