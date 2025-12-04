import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar({ items }) {
  return (
    <aside className="hidden md:flex flex-col gap-2 w-56 pr-4 border-r border-shinra-border">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
        Sections
      </div>
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            [
              'text-xs px-3 py-2 rounded-full border transition-all',
              isActive
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-white hover:border-white/30',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar
