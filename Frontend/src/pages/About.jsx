import { Link } from 'react-router-dom'
import { Sparkles, Shield, Feather, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPlaceholderImage } from '../data/products'

export default function About() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto py-8">
          <span className="text-[11px] font-semibold text-terracotta tracking-widest uppercase">
            Our Story & Atelier
          </span>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
            Craftsmanship outlasting the season.
          </h1>
          <p className="mt-6 text-base text-ink-muted leading-relaxed font-light">
            Founded in Oslo in 2014, Maren & Co was built as an antidote to fast fashion. We create a quiet wardrobe of tailored outerwear, Grade-A cashmere, and vegetable-tanned leather goods — cut in small runs from natural fibers.
          </p>
        </section>

        {/* Feature Image Grid */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-cream-dark shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458e5e?auto=format&fit=crop&w=1000&q=80"
              alt="Maren Oslo Atelier Workshop"
              onError={(e) => {
                e.currentTarget.src = getPlaceholderImage('Atelier Oslo', 'Studio Workshop')
              }}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
              Natural Fibres & Small Batches
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-medium">
              Designed to be worn for a decade, not a summer.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Every pattern begins on our cutting tables in Oslo. By limiting each release to small batches, we maintain uncompromising quality control and eliminate excess inventory.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-block rounded-full bg-ink px-8 py-3.5 text-xs font-medium text-cream transition hover:bg-terracotta"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Values */}
        <section className="mt-20 border-t border-ink/10 pt-16">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-terracotta tracking-widest uppercase">
              Our Core Principles
            </p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl font-medium">Why Maren & Co is different</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-6 backdrop-blur-sm shadow-sm">
              <div className="rounded-full bg-terracotta/10 p-3 w-fit text-terracotta mb-4">
                <Feather className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-medium">Grade-A Cashmere & Wool</h3>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Sourced exclusively from certified ethical farms prioritizing animal welfare and sustainable spinning.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-6 backdrop-blur-sm shadow-sm">
              <div className="rounded-full bg-terracotta/10 p-3 w-fit text-terracotta mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-medium">Hand-Finished Seams</h3>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Master artisans inspect every stitch, ensuring double-reinforced seams and unyielding durability.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-6 backdrop-blur-sm shadow-sm">
              <div className="rounded-full bg-terracotta/10 p-3 w-fit text-terracotta mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-medium">AI-Driven Styling</h3>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Our AI Assistant provides custom size recommendations and capsule wardrobe pairings to reduce returns.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-6 backdrop-blur-sm shadow-sm">
              <div className="rounded-full bg-terracotta/10 p-3 w-fit text-terracotta mb-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-medium">Lifetime Care Guarantee</h3>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                We offer complimentary repair services and care guides for all outerwear and leather goods.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
