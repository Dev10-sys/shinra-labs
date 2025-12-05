import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function PostTaskPage() {
  const user = getStoredUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    task_type: "text",
    difficulty: "easy",
    price: "",
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    const taskData = {
      company_id: user.id,
      title: form.title,
      description: form.description,
      task_type: form.task_type,
      difficulty: form.difficulty,
      price: parseFloat(form.price),
      status: "open",
    };

    // Don't add deadline - column may not exist in schema
    const { error } = await supabase.from("tasks").insert(taskData);

    if (error) {
      console.error(error);
      alert("Failed to post task: " + error.message);
      setSubmitting(false);
      return;
    }

    alert("Task posted successfully!");
    navigate("/company");
  };

  return (
    <section className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Post a New Task</h1>

      <div className="bg-black/40 border border-gray-700 rounded p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Example: Sentiment Annotation for Customer Reviews"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 rounded border border-gray-700 focus:border-white/30 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Describe what freelancers need to do, guidelines, and expected output..."
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 rounded border border-gray-700 focus:border-white/30 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Task Type <span className="text-red-400">*</span>
            </label>
            <select
              name="task_type"
              value={form.task_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 rounded border border-gray-700 focus:border-white/30 outline-none"
            >
              <option value="text">Text Labeling</option>
              <option value="image">Image Tagging</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Difficulty <span className="text-red-400">*</span>
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 rounded border border-gray-700 focus:border-white/30 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              placeholder="5000"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 rounded border border-gray-700 focus:border-white/30 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post Task"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PostTaskPage;
