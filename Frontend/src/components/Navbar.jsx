import { Search, User, ShoppingBag, Menu, X, LogOut, Heart, ShieldCheck, PackageCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import SearchModal from './SearchModal'

const links = [
  { label: 'New Arrivals', to: '/products' },
  { label: 'Outerwear', to: '/products?category=outerwear' },
  { label: 'Knitwear', to: '/products?category=knitwear' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin Portal', to: '/admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const location = useLocation()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
          <ul className="hidden flex-1 items-center gap-6 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`text-[13px] font-medium tracking-wide transition ${
                    link.to === '/admin'
                      ? 'rounded-full bg-ink/5 px-3 py-1 text-terracotta hover:bg-terracotta hover:text-cream'
                      : 'text-ink/80 hover:text-terracotta'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <Link to="/" className="flex flex-col items-center text-center">
            <span className="font-display text-2xl font-medium tracking-tight md:text-[1.65rem]">
              Maren & Co
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase">
              Est. Oslo · 2014
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-ink/80 transition hover:text-terracotta"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-ink/80 transition hover:text-terracotta"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-medium text-cream">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 text-xs font-medium text-ink/90 transition hover:text-terracotta"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-cream text-[11px] font-display">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
                </button>

                {userDropdown && (
                  <div
                    onMouseLeave={() => setUserDropdown(false)}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-ink/10 bg-cream p-2 shadow-xl backdrop-blur-xl"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink transition hover:bg-cream-dark"
                    >
                      <User className="h-4 w-4 text-ink-muted" />
                      Profile & Orders
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-terracotta transition hover:bg-cream-dark"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Portal
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setUserDropdown(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Account"
                className="hidden text-ink/80 transition hover:text-terracotta sm:block"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative text-ink/80 transition hover:text-terracotta"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-medium text-cream">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {open && (
          <div className="fixed inset-0 z-50 bg-cream lg:hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-xl">Maren & Co</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="flex flex-col gap-6 px-5 pt-8">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-display text-3xl"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/wishlist" className="font-display text-3xl" onClick={() => setOpen(false)}>
                  Wishlist ({wishlistCount})
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-display text-3xl" onClick={() => setOpen(false)}>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="font-display text-3xl" onClick={() => setOpen(false)}>
                  Bag {cartCount > 0 && `(${cartCount})`}
                </Link>
              </li>
              <li className="border-t border-ink/10 pt-6">
                {user ? (
                  <button
                    type="button"
                    className="font-display text-2xl text-terracotta"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                  >
                    Sign out
                  </button>
                ) : (
                  <Link to="/login" className="font-display text-2xl" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
