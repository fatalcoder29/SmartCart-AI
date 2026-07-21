import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10 lg:py-16">
        <div className="lg:col-span-1">
          <Link to="/" className="font-display text-2xl font-medium text-cream">
            Maren & Co
          </Link>
          <p className="mt-1 text-[10px] tracking-[0.22em] text-cream/50 uppercase">
            Est. Oslo · 2014
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
            A quiet wardrobe of coats, cashmere and leather — made in small runs for a decade,
            not a summer.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-cream/40 uppercase">
            Shop Collections
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
            <li>
              <Link to="/products" className="hover:text-cream transition">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?category=outerwear" className="hover:text-cream transition">
                Outerwear
              </Link>
            </li>
            <li>
              <Link to="/products?category=knitwear" className="hover:text-cream transition">
                Knitwear
              </Link>
            </li>
            <li>
              <Link to="/products?category=leather" className="hover:text-cream transition">
                Leather Goods
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-cream/40 uppercase">
            House & Care
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
            <li>
              <Link to="/about" className="hover:text-cream transition">
                About Our Atelier
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream transition">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-cream transition">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-cream transition">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-cream/40 uppercase">
            Newsletter
          </p>
          <p className="mt-4 text-sm text-cream/60">Seasonal notes. No spam.</p>
          <form
            className="mt-4 flex border border-cream/20 rounded-lg overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-cream outline-none placeholder:text-cream/35"
            />
            <button
              type="submit"
              className="bg-terracotta px-4 text-[12px] font-medium tracking-wide text-cream transition hover:bg-terracotta/90"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-cream/40 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <p>© {new Date().getFullYear()} Maren & Co. All rights reserved.</p>
          <p>Crafted in Oslo · Ships worldwide</p>
        </div>
      </div>
    </footer>
  )
}
