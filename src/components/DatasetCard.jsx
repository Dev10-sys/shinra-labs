export default function DatasetCard({ dataset, onBuy, onPreview }) {
  return (
    <div className="shinra-card shinra-card-hover p-6 flex flex-col justify-between">

      {/* TOP SECTION */}
      <div className="flex items-start justify-between gap-3">

        {/* TITLE + DESCRIPTION */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {dataset.title}
          </h3>

          <p className="text-gray-400 text-sm mt-1 line-clamp-3">
            {dataset.description}
          </p>
        </div>

        {/* DATA TYPE BADGE */}
        {dataset.data_type && (
          <span className="text-[10px] uppercase tracking-[0.18em] border border-white/40 rounded-full px-2 py-1 text-gray-300">
            {dataset.data_type}
          </span>
        )}
      </div>

      {/* BUTTONS */}
      <div className="mt-5 flex gap-3">

        {/* PREVIEW */}
        <button
          onClick={onPreview}
          className="flex-1 py-2 bg-[#1A1C23] text-white rounded-md border border-[#2A2D34] hover:bg-[#2A2D34] transition"
        >
          Preview
        </button>

        {/* BUY */}
        <button
          onClick={() => onBuy(dataset)}
          className="flex-1 py-2 bg-white text-black rounded-md hover:bg-gray-300 transition"
        >
          ₹{dataset.price}
        </button>

      </div>
    </div>
  );
}
