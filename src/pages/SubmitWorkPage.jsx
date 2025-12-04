import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitWork } from "../demoActions";
import { demoMyWork } from "../demoData";

export default function SubmitWorkPage() {
  const navigate = useNavigate();

  const [taskId, setTaskId] = useState("");
  const [itemsDone, setItemsDone] = useState("");
  const [notes, setNotes] = useState("");

  // Only show tasks the freelancer accepted
  const myTasks = demoMyWork;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskId || !itemsDone || !notes.trim()) {
      alert("Please fill all fields!");
      return;
    }

    const selectedTask = myTasks.find((t) => t.id === taskId);

    if (!selectedTask) {
      alert("Invalid task selected.");
      return;
    }

    submitWork({
      task: selectedTask.task,
      itemsDone: Number(itemsDone),
      notes,
    });

    alert("Work submitted (demo)");

    // Clear fields
    setTaskId("");
    setItemsDone("");
    setNotes("");

    navigate("/freelancer");
  };

  return (
    <div className="max-w-2xl mx-auto bg-black/40 border border-gray-700 p-6 rounded text-white mt-10">
      <h1 className="text-xl font-bold mb-4 tracking-wide">
        Submit Work
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Dropdown: Accepted Tasks */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Select Task
          </label>

          <select
            className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
          >
            <option value="">-- Choose a task --</option>

            {myTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.task}
              </option>
            ))}
          </select>
        </div>

        {/* Items Done */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Items Completed
          </label>
          <input
            type="number"
            min="1"
            className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm"
            placeholder="Enter number of items"
            value={itemsDone}
            onChange={(e) => setItemsDone(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Submission Notes
          </label>
          <textarea
            className="w-full bg-black/50 border border-gray-700 p-2 rounded text-sm h-24"
            placeholder="Explain what you did…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-black transition"
        >
          Submit Work
        </button>
      </form>
    </div>
  );
}
