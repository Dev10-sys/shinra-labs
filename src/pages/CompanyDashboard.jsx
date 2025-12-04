import React, { useState } from "react";

import {
  demoCompanyStats,
  demoCompanyTasks,
  demoPostedTasks,
  demoSubmissionsQueue,
} from "../demoData";

import { approveSubmission, rejectSubmission } from "../demoActions";
import { Link } from "react-router-dom";

export default function CompanyDashboard() {
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((x) => x + 1);

  // Combined tasks (company created + posted via form)
  const allTasks = [...demoCompanyTasks, ...demoPostedTasks];

  // Update company stats live
  const liveStats = {
    ...demoCompanyStats,
    pendingSubmissions: demoSubmissionsQueue.filter(
      (s) => s.status === "Pending review"
    ).length,
    activeTasks: allTasks.filter((t) => t.status === "Open").length,
  };

  return (
    <div className="text-white space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold tracking-wide">
        Company Dashboard
      </h1>

      {/* ----------- STATS ----------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Spend" value={liveStats.totalSpend} />
        <StatCard label="Active Tasks" value={liveStats.activeTasks} />
        <StatCard label="Completed Tasks" value={liveStats.completedTasks} />
        <StatCard label="Pending Reviews" value={liveStats.pendingSubmissions} />
      </div>

      {/* ----------- POSTED TASKS ----------- */}
      <h2 className="text-xl font-semibold mt-6">Your Posted Tasks</h2>

      {allTasks.length === 0 && (
        <div className="text-gray-400 text-sm">
          No tasks posted yet. Create one through the Post New Task page.
        </div>
      )}

      <div className="space-y-4">
        {allTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-black/40 border border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">

              {/* ⭐ Click to open full details */}
              <Link
                to={`/task/${task.id}`}
                className="font-semibold text-lg text-blue-400 hover:underline"
              >
                {task.title}
              </Link>

              <span className="text-xs bg-white/10 px-3 py-1 rounded">
                {task.status}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-1">
              {task.description}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
              <Info label="Payout" value={task.payout} />
              <Info label="Items" value={task.items} />
              <Info label="Completed" value={task.completed || 0} />
            </div>
          </div>
        ))}
      </div>

      {/* ----------- SUBMISSIONS ----------- */}
      <h2 className="text-xl font-semibold mt-8">Pending Submissions</h2>

      {demoSubmissionsQueue.length === 0 && (
        <div className="text-gray-400 text-sm">No submissions to review.</div>
      )}

      <div className="space-y-4">
        {demoSubmissionsQueue.map((sub) => (
          <div
            key={sub.id}
            className="p-4 bg-black/40 border border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{sub.task}</div>

              <span className="text-xs bg-white/10 px-3 py-1 rounded">
                {sub.status}
              </span>
            </div>

            <p className="text-gray-300 mt-1 text-sm">
              Freelancer: <span className="font-medium">{sub.freelancer}</span>
            </p>

            <p className="text-gray-300 text-sm">
              Items Labeled: <span className="font-medium">{sub.items}</span>
            </p>

            <p className="text-gray-400 text-xs mt-1">
              Submitted: {sub.submittedAt}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  approveSubmission(sub.id);
                  refresh();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => {
                  rejectSubmission(sub.id);
                  refresh();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-black/40 border border-gray-700 rounded">
      <div className="text-gray-400 text-xs uppercase tracking-wider">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-gray-400">{label}:</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
