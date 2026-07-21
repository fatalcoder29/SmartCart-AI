const quotes = [
  {
    text: 'The Oslo coat is the first outerwear I have owned for more than two winters. It still looks new.',
    name: 'Ingrid L.',
    place: 'Bergen',
  },
  {
    text: 'Quiet luxury without the noise. Packaging, fit, and finish all feel intentional.',
    name: 'Marcus H.',
    place: 'Copenhagen',
  },
  {
    text: 'I bought the cashmere crew three years ago. It has softened, never pilled, never faded.',
    name: 'Sofia R.',
    place: 'Stockholm',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
            Worn & loved
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
            Words from the wardrobe
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {quotes.map((q) => (
            <blockquote key={q.name} className="border-t border-ink/10 pt-6">
              <p className="font-display text-xl leading-snug font-medium text-ink/90 md:text-[1.35rem]">
                “{q.text}”
              </p>
              <footer className="mt-6 text-sm text-ink-muted">
                <span className="font-medium text-ink">{q.name}</span>
                <span className="mx-2 text-ink/30">·</span>
                {q.place}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
