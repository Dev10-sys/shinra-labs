import React from "react";

function StatCard({ label, value, sub }) {
  return (
    <div className="shinra-card px-5 py-4 flex flex-col gap-1">

      {/* Label */}
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
        {label}
      </div>

      {/* Main value */}
      <div className="text-2xl font-semibold">
        {value ?? "—"}
      </div>

      {/* Optional subtext */}
      {sub && (
        <div className="text-[11px] text-gray-400">
          {sub}
        </div>
      )}
    </div>
  );
}

export default StatCard;
