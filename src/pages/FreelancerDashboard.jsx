import React, { useState } from "react";
import {
  demoFreelancerStats,
  demoAvailableTasks,
  demoMyWork,
} from "../demoData";

import { acceptTask, submitWork } from "../demoActions";

export default function FreelancerDashboard() {
  const [available, setAvailable] = useState(demoAvailableTasks);
  const [myWork, setMyWork] = useState(demoMyWork);

  // NOTES PER TASK
  const [notes, setNotes] = useState({});

  const handleNoteChange = (id, value) => {
    setNotes({ ...notes, [id]: value });
  };

  /* ---------------------------------------------------
        ACCEPT TASK — FIXED FLOW
        ✔ Remove from available
        ✔ Add to myWork
        ✔ Prevent duplicates
  ---------------------------------------------------- */
  const handleAcceptTask = (id) => {
    const already = demoMyWork.some((t) => t.id === id);
    if (already) {
      alert("You already accepted this task.");
      return;
    }

    acceptTask(id); // backend demo push

    // Remove from UI list
    setAvailable((prev) => prev.filter((t) => t.id !== id));

    // Refresh work list
    setMyWork([...demoMyWork]);

    alert("Task accepted (demo)");
  };

  /* ---------------------------------------------------
        SUBMIT WORK — FIXED FLOW
        ✔ Pass correct task + id
        ✔ Items counted from notes length
        ✔ Clear notes
        ✔ UI refresh on submit
  ---------------------------------------------------- */
  const handleSubmitWork = (taskObj) => {
    const taskId = taskObj.id;
    const taskTitle = taskObj.task;

    if (!notes[taskId] || !notes[taskId].trim()) {
      alert("Write something before submitting!");
      return;
    }

    submitWork({
      taskId,
      task: taskTitle,
      itemsDone: notes[taskId].length, // demo calculation
      notes: notes[taskId],
    });

    alert("Work submitted (demo)");

    // Clear only this task’s notes
    setNotes((prev) => ({ ...prev, [taskId]: "" }));

    // Update local UI
    setMyWork([...demoMyWork]);
  };

  return (
    <div className="text-white mt-6">
      <h1 className="text-2xl font-bold mb-4 tracking-wide">
        Freelancer Dashboard
      </h1>

      {/* -------------------- STATS -------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Total Earnings" value={demoFreelancerStats.totalEarnings} />
        <StatCard label="Tasks Completed" value={demoFreelancerStats.tasksCompleted} />
        <StatCard label="Rank" value={`#${demoFreelancerStats.rank}`} />
      </section>

      {/* ---------------- AVAILABLE TASKS ---------------- */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3 tracking-wide">
          Available Tasks
        </h2>

        {available.length === 0 && (
          <p className="text-gray-400 text-[13px]]">No tasks available right now.</p>
        )}

        <div className="space-y-3">
          {available.map((task) => (
            <div
              key={task.id}
              className="p-4 border border-gray-700 bg-black/40 rounded"
            >
              <a
                href={`/task/${task.id}`}
                className="font-semibold text-blue-400 hover:underline text-lg"
              >
                {task.title}
              </a>

              <p className="text-gray-400 text-sm">
                Company: {task.company}
              </p>

              <div className="flex justify-between mt-2 text-sm">
                <span>Rate: {task.payoutPerItem}/item</span>
                <span>Est. Items: {task.estItems}</span>
                <span>Time: {task.time}</span>
              </div>

              <button
                onClick={() => handleAcceptTask(task.id)}
                className="mt-3 px-3 py-1 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition"
              >
                Accept Task
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------ MY WORK ------------------ */}
      <section>
        <h2 className="text-lg font-semibold mb-3 tracking-wide">
          My Tasks In Progress
        </h2>

        {myWork.length === 0 && (
          <p className="text-gray-400 text-sm">
            You haven’t accepted any tasks yet.
          </p>
        )}

        <div className="space-y-3">
          {myWork.map((task) => (
            <div
              key={task.id}
              className="p-4 border border-gray-700 bg-black/40 rounded"
            >
              <a
                href={`/task/${task.id}`}
                className="font-semibold text-blue-400 hover:underline text-lg"
              >
                {task.task}
              </a>

              <p className="text-gray-400 text-sm">
                Items Labeled: {task.itemsLabeled}
              </p>
              <p className="text-gray-400 text-sm">
                Status: {task.status}
              </p>
              <p className="text-gray-400 text-sm">
                Earnings: {task.earning}
              </p>

              <textarea
                className="w-full mt-3 bg-black/50 border border-gray-700 p-2 rounded text-sm"
                placeholder="Write your submitted work notes here (demo)..."
                value={notes[task.id] || ""}
                onChange={(e) => handleNoteChange(task.id, e.target.value)}
              />

              <button
                onClick={() => handleSubmitWork(task)}
                className="mt-3 px-3 py-1 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-black transition"
              >
                Submit Work
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-black/40 border border-gray-700 rounded">
      <p className="text-gray-400 text-xs uppercase">{label}</p>
      <h3 className="text-xl font-semibold mt-1">{value}</h3>
    </div>
  );
}
