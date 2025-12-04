import React from 'react'

function DatasetCard({ dataset, onBuy }) {
  return (
    <div className="shinra-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium">{dataset.title}</div>
          <div className="text-[14px] text-gray-400 line-clamp-2">
            {dataset.description}
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] border border-white/40 rounded-full px-2 py-1">
          {dataset.data_type}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-300">
        <div>
          <div className="text-xs font-semibold">₹{dataset.price}</div>
          <div className="text-[10px] text-gray-500">
            {dataset.downloads || 0} downloads
          </div>
        </div>
        <button
          type="button"
          onClick={() => onBuy?.(dataset)}
          className="ml-auto text-[10px] uppercase tracking-[0.18em] border border-white/60 rounded-full px-3 py-1 hover:bg-white hover:text-black transition-colors"
        >
          Buy Access
        </button>
      </div>
    </div>
  )
}

export default DatasetCard
