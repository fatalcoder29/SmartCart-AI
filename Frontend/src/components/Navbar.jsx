import { Search, User, ShoppingBag, Menu, X, LogOut, Heart, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import SearchModal from './SearchModal'

const baseLinks = [
  { label: 'New Arrivals', to: '/products' },
  { label: 'Outerwear', to: '/products?category=outerwear' },
  { label: 'Knitwear', to: '/products?category=knitwear' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const location = useLocation()

  const links = user?.role === 'admin'
    ? [...baseLinks, { label: 'Admin Portal', to: '/admin' }]
    : baseLinks

  useEffect(() => {
    if (open) {
      setMenuVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function closeMenu() {
    setMenuVisible(false)
    setTimeout(() => setOpen(false), 280)
  }

  function openMenu() {
    setOpen(true)
  }

  useEffect(() => {
    if (open) closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-ink/10 bg-cream shadow-sm"
        style={{ backgroundColor: '#fdfbf7' }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4 md:px-8 lg:px-10">
          <ul className="hidden flex-1 items-center gap-5 xl:gap-6 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`nav-link text-[13px] font-medium tracking-wide ${
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
            className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            aria-label="Open menu"
            onClick={openMenu}
          >
            <Menu className="h-5 w-5 transition-transform duration-200" strokeWidth={1.5} />
          </button>

          <Link
            to="/"
            className="group flex flex-col items-center text-center transition-opacity hover:opacity-80"
          >
            <span className="font-display text-xl font-medium tracking-tight transition-colors group-hover:text-terracotta sm:text-2xl md:text-[1.65rem]">
              Maren & Co
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase sm:inline">
              Est. Oslo · 2014
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-full text-ink/80"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="nav-icon-btn relative flex h-10 w-10 items-center justify-center rounded-full text-ink/80"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-medium text-cream animate-badge-pop">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="nav-icon-btn flex items-center gap-1.5 rounded-full px-1.5 py-1 text-xs font-medium text-ink/90"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-display text-cream transition-transform duration-200 hover:scale-105">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
                </button>

                {userDropdown && (
                  <div
                    onMouseLeave={() => setUserDropdown(false)}
                    className="nav-dropdown absolute right-0 mt-2 w-48 rounded-2xl border border-ink/10 bg-cream p-2 shadow-xl"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-cream-dark"
                    >
                      <User className="h-4 w-4 text-ink-muted" />
                      Profile & Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-terracotta transition-colors hover:bg-cream-dark"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Portal
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setUserDropdown(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
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
                className="nav-icon-btn hidden h-10 w-10 items-center justify-center rounded-full text-ink/80 sm:flex"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}

            <Link
              to="/cart"
              aria-label="Cart"
              className="nav-icon-btn relative flex h-10 w-10 items-center justify-center rounded-full text-ink/80"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-medium text-cream animate-badge-pop">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {open && (
          <div
            className={`fixed inset-0 z-50 flex flex-col lg:hidden ${
              menuVisible ? 'nav-menu-enter' : 'nav-menu-exit'
            }`}
            style={{ backgroundColor: '#fdfbf7' }}
          >
            <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
              <span className="font-display text-xl tracking-tight">Maren & Co</span>
              <button
                type="button"
                aria-label="Close menu"
                className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-full"
                onClick={closeMenu}
              >
                <X className="h-5 w-5 transition-transform duration-200 hover:rotate-90" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
              {links.map((link, i) => (
                <li
                  key={link.label}
                  className="nav-menu-item"
                  style={{ animationDelay: `${60 + i * 45}ms` }}
                >
                  <Link
                    to={link.to}
                    className="nav-mobile-link block rounded-xl px-3 py-3.5 font-display text-2xl transition-colors sm:text-3xl"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-menu-item" style={{ animationDelay: `${60 + links.length * 45}ms` }}>
                <Link to="/wishlist" className="nav-mobile-link block rounded-xl px-3 py-3.5 font-display text-2xl transition-colors sm:text-3xl" onClick={closeMenu}>
                  Wishlist ({wishlistCount})
                </Link>
              </li>
              <li className="nav-menu-item" style={{ animationDelay: `${60 + (links.length + 1) * 45}ms` }}>
                <Link to="/profile" className="nav-mobile-link block rounded-xl px-3 py-3.5 font-display text-2xl transition-colors sm:text-3xl" onClick={closeMenu}>
                  My Account
                </Link>
              </li>
              <li className="nav-menu-item" style={{ animationDelay: `${60 + (links.length + 2) * 45}ms` }}>
                <Link to="/cart" className="nav-mobile-link block rounded-xl px-3 py-3.5 font-display text-2xl transition-colors sm:text-3xl" onClick={closeMenu}>
                  Bag {cartCount > 0 && `(${cartCount})`}
                </Link>
              </li>
              <li className="nav-menu-item mt-4 border-t border-ink/10 pt-6" style={{ animationDelay: `${60 + (links.length + 3) * 45}ms` }}>
                {user ? (
                  <button
                    type="button"
                    className="nav-mobile-link block w-full rounded-xl px-3 py-3.5 text-left font-display text-xl text-terracotta transition-colors sm:text-2xl"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                  >
                    Sign out
                  </button>
                ) : (
                  <Link to="/login" className="nav-mobile-link block rounded-xl px-3 py-3.5 font-display text-xl transition-colors sm:text-2xl" onClick={closeMenu}>
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
