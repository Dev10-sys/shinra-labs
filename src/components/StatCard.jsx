import React from 'react'

function StatCard({ label, value, sub }) {
  return (
    <div className="shinra-card px-5 py-4 flex flex-col gap-1">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
    </div>
  )
}

export default StatCard
