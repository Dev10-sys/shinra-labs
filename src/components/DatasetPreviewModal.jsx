import React from "react";

export default function DatasetPreviewModal({ dataset, onClose }) {
  if (!dataset) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#0F1014] border border-[#1E1F23] rounded-xl w-full max-w-2xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {dataset.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">{dataset.description}</p>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">

          {dataset.preview && dataset.preview.length > 0 ? (
            dataset.preview.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-[#1A1C23] rounded-lg border border-[#2A2D34]"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="preview"
                    className="w-full rounded mb-2"
                  />
                )}

                {item.text && (
                  <p className="text-gray-200 mb-1">{item.text}</p>
                )}

                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Label: {item.label}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">
              No preview samples available.
            </div>
          )}

        </div>

        {/* Buy Button */}
        <button
          className="w-full mt-5 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-300"
          onClick={() => alert("Buy from main marketplace")}
        >
          Buy Dataset
        </button>
      </div>
    </div>
  );
}
