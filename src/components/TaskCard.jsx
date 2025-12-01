import React from "react";

function TaskCard({ task, onPick }) {
  return (
    <div className="shinra-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium">{task.title}</div>
          <div className="text-[11px] text-gray-400 line-clamp-2">
            {task.description}
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] border border-white/40 rounded-full px-2 py-1">
          {task.task_type}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-300">
        <div>
          <div className="text-xs font-semibold">₹{task.payout}</div>
          <div className="text-[10px] text-gray-500">per batch</div>
        </div>
        {task.estimated_time_minutes && (
          <div className="text-[10px] text-gray-400">
            Estimated {task.estimated_time_minutes} min
          </div>
        )}
        <button
          type="button"
          onClick={() => onPick?.(task)}
          className="ml-auto text-[10px] uppercase tracking-[0.18em] border border-white/60 rounded-full px-3 py-1 hover:bg-white hover:text-black transition-colors"
        >
          Pick task
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
