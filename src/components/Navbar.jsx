import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/freelancer', label: 'Freelancers' },
  { to: '/company', label: 'Companies' },
  { to: '/datasets', label: 'Datasets' },
]

function Navbar() {
  const location = useLocation()

  // Simple text for showing view (student-friendly logic)
  const currentView =
    location.pathname.replace('/', '') === ''
      ? 'overview'
      : location.pathname.replace('/', '') + ' view'

  return (
    <header className="border-b border-shinra-border bg-black/40 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded border border-shinra-border flex items-center justify-center text-xs font-semibold tracking-[0.2em]">
            SL
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-medium tracking-[0.18em] uppercase">
              Shinra Labs
            </span>
            <span className="text-[10px] text-gray-400">
              Decentralized AI Workforce
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: View text + Login */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] text-gray-400 uppercase tracking-[0.18em]">
            {currentView}
          </span>

          <Link
            to="/login"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] border px-3 py-1.5 rounded-full border-white/40 hover:bg-white hover:text-black transition-colors"
          >
            Log in
          </Link>
        </div>

      </nav>
    </header>
  )
}

export default Navbar
