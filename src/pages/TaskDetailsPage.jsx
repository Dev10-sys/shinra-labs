import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredUser } from "../authUtils";

import {
  demoCompanyTasks,
  demoAvailableTasks,
  demoSubmissionsQueue,
  demoPostedTasks,
  demoMyWork
} from "../demoData";

import {
  acceptTask,
  approveSubmission,
  rejectSubmission
} from "../demoActions";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [, forceUpdate] = useState(0);

  // FINAL unified task search
  const task =
    demoCompanyTasks.find((t) => t.id === id) ||
    demoPostedTasks.find((t) => t.id === id) ||       // NEW
    demoAvailableTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="text-white mt-20 text-center text-lg">
        Task not found.
      </div>
    );
  }

  const submissions = demoSubmissionsQueue.filter(
    (s) => s.task === task.title
  );

  // Check if user already accepted this task
  const alreadyAccepted = demoMyWork.some((t) => t.id === id);

  return (
    <div className="text-white mt-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 px-3 py-1 border border-gray-600 text-xs rounded hover:bg-white hover:text-black transition"
      >
        ← Back
      </button>

      {/* Title & Description */}
      <h1 className="text-2xl font-bold tracking-wide">{task.title}</h1>
      <p className="text-gray-400 mt-2">{task.description}</p>

      {/* STAT GRID */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">

        <div className="p-4 bg-black/40 border border-gray-700 rounded">
          <p className="text-xs text-gray-400">Payout</p>
          <h3 className="text-lg font-semibold">
            {task.payout ?? task.payoutPerItem}
          </h3>
        </div>

        <div className="p-4 bg-black/40 border border-gray-700 rounded">
          <p className="text-xs text-gray-400">Items</p>
          <h3 className="text-lg font-semibold">
            {task.items ?? task.estItems}
          </h3>
        </div>

        <div className="p-4 bg-black/40 border border-gray-700 rounded">
          <p className="text-xs text-gray-400">Status</p>
          <h3 className="text-lg font-semibold">{task.status || "Open"}</h3>
        </div>

      </div>

      {/* --------------------- FREELANCER VIEW --------------------- */}
      {user?.role === "freelancer" && (
        <div className="mt-10">

          <h2 className="text-lg font-semibold mb-2">Task Instructions</h2>

          <ul className="text-gray-300 text-sm list-disc ml-6 space-y-1">
            <li>Read all instructions before starting.</li>
            <li>Submit your labeled work from the Submit Work page.</li>
            <li>Higher accuracy → faster payments.</li>
          </ul>

          {!alreadyAccepted ? (
            <button
              onClick={() => {
                acceptTask(task.id);
                alert("Task accepted!");
                forceUpdate((x) => x + 1);
              }}
              className="mt-6 px-4 py-2 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition"
            >
              Accept Task
            </button>
          ) : (
            <div className="mt-6 text-green-400 text-sm">
              You have already accepted this task.
            </div>
          )}
        </div>
      )}

      {/* --------------------- COMPANY VIEW --------------------- */}
      {user?.role === "company" && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-3">Submissions</h2>

          {submissions.length === 0 && (
            <p className="text-gray-400 text-sm">No submissions yet.</p>
          )}

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 border border-gray-700 bg-black/40 rounded"
              >
                <p className="font-semibold">{sub.freelancer}</p>
                <p className="text-sm mt-1">Items: {sub.items}</p>
                <p className="text-xs text-gray-400">
                  Submitted: {sub.submittedAt}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      approveSubmission(sub.id);
                      forceUpdate((x) => x + 1); // refresh page
                    }}
                    className="px-3 py-1 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      rejectSubmission(sub.id);
                      forceUpdate((x) => x + 1);
                    }}
                    className="px-3 py-1 border border-red-400 text-red-400 rounded hover:bg-red-400 hover:text-black transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
