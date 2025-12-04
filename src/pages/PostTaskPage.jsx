import React, { useState } from "react";
import { createTask } from "../demoActions";
import { useNavigate } from "react-router-dom";

export default function PostTaskPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    items: "",
    payout: "",
    difficulty: "",
    sampleFile: null, // only demo
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.items || !form.payout) {
      alert("Please fill all required fields");
      return;
    }

    createTask({
      title: form.title,
      description: form.description,
      items: Number(form.items),
      payout: form.payout,
      difficulty: form.difficulty || "Medium",
      sampleFile: form.sampleFile ? form.sampleFile.name : "None",
      status: "Open",
    });

    alert("Task posted (demo)");
    navigate("/company");
  };

  return (
    <div className="max-w-2xl mx-auto bg-black/40 border border-gray-700 p-6 rounded text-white mt-10">

      <h1 className="text-xl font-semibold mb-4 tracking-wide">
        Post a New Task
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Task Title */}
        <div>
          <label className="text-sm text-gray-300">Task Title *</label>
          <input
            type="text"
            name="title"
            className="inp"
            placeholder="Example: Hindi Sentiment Labeling"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-300">Description *</label>
          <textarea
            name="description"
            className="inp h-24"
            placeholder="Describe what freelancers need to do..."
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Items */}
        <div>
          <label className="text-sm text-gray-300">Total Items *</label>
          <input
            type="number"
            name="items"
            className="inp"
            placeholder="Example: 5000"
            value={form.items}
            onChange={handleChange}
          />
        </div>

        {/* Payout */}
        <div>
          <label className="text-sm text-gray-300">Payout Per Item *</label>
          <input
            type="number"
            name="payout"
            className="inp"
            placeholder="₹0.50 / item"
            value={form.payout}
            onChange={handleChange}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-sm text-gray-300">Difficulty Level</label>
          <select
            name="difficulty"
            className="inp"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Sample Dataset Upload */}
        <div>
          <label className="text-sm text-gray-300">Sample Dataset (Demo Only)</label>
          <input
            type="file"
            name="sampleFile"
            className="w-full text-sm text-gray-300 mt-1"
            onChange={handleChange}
          />
          <p className="text-gray-400 text-xs mt-1">
            Upload a small sample CSV / TXT (demo only, not used in backend)
          </p>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-black transition"
          type="submit"
        >
          Post Task
        </button>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs text-gray-400"
        >
          Back
        </button>
      </form>
    </div>
  );
}
