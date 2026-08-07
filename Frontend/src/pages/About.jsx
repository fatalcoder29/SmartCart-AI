import { Link } from 'react-router-dom'
import { Sparkles, Shield, Feather, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPlaceholderImage } from '../data/products'

const values = [
  { icon: Feather, title: 'Grade-A Cashmere & Wool', desc: 'Sourced exclusively from certified ethical farms prioritizing animal welfare and sustainable spinning.' },
  { icon: Shield, title: 'Hand-Finished Seams', desc: 'Master artisans inspect every stitch, ensuring double-reinforced seams and unyielding durability.' },
  { icon: Sparkles, title: 'AI-Driven Styling', desc: 'Our AI Assistant provides custom size recommendations and capsule wardrobe pairings to reduce returns.' },
  { icon: RefreshCw, title: 'Lifetime Care Guarantee', desc: 'We offer complimentary repair services and care guides for all outerwear and leather goods.' },
]

export default function About() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl py-8 text-center">
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Our story & atelier</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">Craftsmanship outlasting the season.</h1>
          <p className="mt-6 text-base font-light leading-relaxed text-ink-muted">
            Founded in Oslo in 2014, Maren & Co was built as an antidote to fast fashion. We create a quiet wardrobe of tailored outerwear, Grade-A cashmere, and vegetable-tanned leather goods — cut in small runs from natural fibers.
          </p>
        </section>

        <section className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dark shadow-lg">
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458e5e?auto=format&fit=crop&w=1000&q=80" alt="Maren Oslo Atelier Workshop" onError={(e) => { e.currentTarget.src = getPlaceholderImage('Atelier Oslo', 'Studio Workshop') }} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
          </div>
          <div className="space-y-5">
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Natural fibres & small batches</p>
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">Designed to be worn for a decade, not a summer.</h2>
            <p className="text-sm leading-relaxed text-ink-muted">Every pattern begins on our cutting tables in Oslo. By limiting each release to small batches, we maintain uncompromising quality control and eliminate excess inventory.</p>
            <Link to="/products" className="btn-primary mt-2 inline-flex rounded-full">Explore collection</Link>
          </div>
        </section>

        <section className="mt-20 border-t border-ink/10 pt-16">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Our core principles</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">Why Maren & Co is different</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-ink/10 bg-cream p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 w-fit rounded-full bg-terracotta/10 p-3 text-terracotta">
                  <v.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-medium">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
