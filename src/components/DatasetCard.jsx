import { CheckCircle, ShieldCheck, Sparkles, TrendingUp, Info } from 'lucide-react';

export default function DatasetCard({ dataset, onBuy, onPreview, isSelected, onToggleSelect, isRecommended }) {
  return (
    <div className={`shinra-card shinra-card-hover p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300 relative ${isRecommended ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5' : ''} ${isSelected ? 'border-indigo-500 bg-[#1A1C23]' : ''}`}>

      {/* TOP SECTION */}
      <div className="flex items-start justify-between gap-3">

        {/* TITLE + DESCRIPTION */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {dataset.title}
          </h3>

          <p className="text-gray-350 text-sm mt-1 line-clamp-3">
            {dataset.description}
          </p>

          {/* QUALITY BADGES */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Mock Logic for Badges based on ID suffix/random */}
            {dataset.id.length % 2 === 0 && (
              <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-700/30">
                <CheckCircle className="w-3 h-3" /> QA Verified
              </span>
            )}
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-700/30">
              <Sparkles className="w-3 h-3" /> AI Reviewed
            </span>
            {dataset.price > 2000 && (
              <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded border border-purple-700/30">
                <ShieldCheck className="w-3 h-3" /> Gold Tier
              </span>
            )}
          </div>
        </div>

        {/* DATA TYPE BADGE */}
        <div className="flex flex-col items-end gap-2">
          {dataset.data_type && (
            <span className="text-[10px] uppercase tracking-[0.18em] border border-white/40 rounded-full px-2 py-1 text-gray-300">
              {dataset.data_type}
            </span>
          )}

          {/* COMPARE CHECKBOX */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <span className="text-[10px] text-gray-500 group-hover:text-gray-300 uppercase tracking-wider transition-colors">Compare</span>
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onToggleSelect && onToggleSelect(dataset)}
              className="w-4 h-4 rounded border-gray-600 bg-[#0F1014] text-indigo-600 focus:ring-offset-[#1A1C23]"
            />
          </label>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-5 flex gap-3">

        {/* PREVIEW */}
        <button
          onClick={onPreview}
          className="flex-1 py-2 px-3 bg-[#1A1C23] text-white rounded-lg border border-[#2A2D34] hover:bg-[#252931] hover:border-gray-400 hover:scale-105 transition-all duration-200 font-medium text-sm"
        >
          Preview
        </button>

        {/* BUY */}
        <div className="relative group/price flex-1">
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(dataset); }}
            className="w-full py-2 px-3 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-200 font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1"
          >
            ₹{dataset.price}
          </button>

          {/* SMART PRICING TOOLTIP */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0F1014] border border-gray-800 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover/price:opacity-100 group-hover/price:visible transition-all z-20 pointer-events-none">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Smart Pricing</div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Avg. Cost/Item</span>
              <span className="text-white">₹{(dataset.price / 500).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-indigo-300">
              <span className="flex items-center gap-1"><TrendingUp size={10} /> Est. ROI</span>
              <span>3.5x</span>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}
