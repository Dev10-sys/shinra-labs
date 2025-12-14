import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";

function PostTaskPage() {
  const user = getStoredUser();
  const navigate = useNavigate();

  // Mode: "upload" | "scanning" | "classified" | "prelabel" | "form"
  const [pipelineStep, setPipelineStep] = useState("upload");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Scanned Meta
  const [scannedMeta, setScannedMeta] = useState(null);

  // AI Pre-Label Data
  const [preLabelData, setPreLabelData] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    task_type: "text",
    difficulty: "easy",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // --- 1. SIMULATE UPLOAD & SCANNING ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPipelineStep("scanning");

    // Animate Progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);

        // Mock Classification Result
        const isImage = file.type.startsWith("image") || file.name.match(/\.(jpg|jpeg|png)$/i);
        const meta = {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          type: isImage ? "image" : "text",
          schema: isImage ? "PixelGrid_v2" : "UTF8_Stream",
          previewUrl: isImage ? URL.createObjectURL(file) : null
        };
        setScannedMeta(meta);
        setForm(prev => ({
          ...prev,
          task_type: meta.type,
          title: `Ingested: ${file.name}`
        }));

        // Transition
        setTimeout(() => setPipelineStep("classified"), 500);
      }
    }, 50);
  };

  // --- 2. TRIGGER AI PRE-LABELING ---
  const handleRunAIPreLabel = async () => {
    setPipelineStep("prelabel");
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    // Mock Result
    setPreLabelData({
      confidence: 0.94,
      timeSaved: "85%",
      detectedEntities: scannedMeta.type === "image"
        ? ["Car (99%)", "Pedestrian (92%)", "Traffic Light (88%)"]
        : ["Sentiment: Positive", "Intent: Purchase", "Urgency: High"],
      boundingBoxes: scannedMeta.type === "image" ? [
        { id: 1, x: 20, y: 30, w: 40, h: 50, label: "Car" },
        { id: 2, x: 70, y: 60, w: 10, h: 20, label: "Person" }
      ] : []
    });

    // Auto-fill price estimate
    setForm(prev => ({
      ...prev,
      price: scannedMeta.type === "image" ? 0.05 : 0.02,
      difficulty: "medium",
      description: `Auto-generated task from ${scannedMeta.name}. AI Pre-labeling applied with 94% confidence.`
    }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // ... submit logic ...
    const taskData = {
      company_id: user.id,
      title: form.title,
      description: form.description,
      task_type: form.task_type,
      difficulty: form.difficulty,
      price: parseFloat(form.price) * 1000, // Batch price hack
      status: "open",
    };

    try {
      await supabase.from("tasks").insert(taskData);
      alert("Pipeline Ingestion Complete. Task Broadcasted.");
      navigate("/company");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-12 px-6 animate-fade-in font-sans text-white">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Shinra Data Loop</div>
          <h1 className="text-2xl font-medium tracking-tight">Ingestion Engine</h1>
        </div>
        <div className="flex gap-4 text-xs font-mono text-gray-500">
          <span className={pipelineStep === 'upload' ? "text-blue-400" : ""}>1. UPLOAD</span>
          <span className={['scanning', 'classified'].includes(pipelineStep) ? "text-blue-400" : ""}>2. CLASSIFY</span>
          <span className={pipelineStep === 'prelabel' ? "text-blue-400" : ""}>3. PRE-LABEL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT: VISUALIZER / UPLOAD */}
        <div className="bg-black border border-white/10 p-1 relative h-96 flex flex-col items-center justify-center overflow-hidden">
          {/* GRID BACKGROUND */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {pipelineStep === "upload" && (
            <div className="z-10 text-center">
              <div className="w-16 h-16 border border-dashed border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:border-white transition-colors cursor-pointer relative">
                <span className="text-2xl">⚡</span>
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <p className="text-sm font-medium">Drag raw data here</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Supports JSON, CSV, PNG, WAV</p>
            </div>
          )}

          {pipelineStep === "scanning" && (
            <div className="z-10 w-full max-w-xs text-center space-y-4">
              <div className="text-xs font-mono text-blue-400 animate-pulse">SCANNING DATA STRUCTURE...</div>
              <div className="h-1 bg-gray-800 w-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <div className="font-mono text-[10px] text-gray-500">
                {uploadProgress}% COMPLETE
              </div>
            </div>
          )}

          {(pipelineStep === "classified" || pipelineStep === "prelabel") && scannedMeta && (
            <div className="z-10 w-full h-full p-4 flex flex-col">
              {/* META HEADER */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Input Source</div>
                  <div className="font-mono text-sm">{scannedMeta.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase">Heuristic Type</div>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                    {scannedMeta.type}
                  </span>
                </div>
              </div>

              {/* PREVIEW AREA */}
              <div className="flex-1 bg-white/5 relative items-center justify-center flex border border-white/5 overflow-hidden">
                {scannedMeta.previewUrl ? (
                  <>
                    <img src={scannedMeta.previewUrl} alt="preview" className="max-h-full max-w-full opacity-50 grayscale" />
                    {preLabelData && preLabelData.boundingBoxes.map(box => (
                      <div
                        key={box.id}
                        className="absolute border-2 border-green-500 bg-green-500/20 text-[10px] text-white font-bold px-1"
                        style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
                      >
                        {box.label}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="font-mono text-xs text-gray-600 p-4">
                    {preLabelData ? JSON.stringify(preLabelData.detectedEntities, null, 2) : "Raw Text Stream Preview..."}
                  </div>
                )}

                {/* PRE-LABEL OVERLAY */}
                {pipelineStep === "prelabel" && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/90 border border-green-500/30 p-3 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full"></span>
                        AI Pre-Label Active
                      </span>
                      <span className="font-mono text-xs text-white">{preLabelData?.confidence * 100}% CONFIDENCE</span>
                    </div>
                    <div className="h-px bg-white/10 mb-2"></div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>EST. TIME SAVED: <span className="text-white">{preLabelData?.timeSaved}</span></span>
                      <span>ENTITIES: <span className="text-white">{preLabelData?.detectedEntities.length}</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: CONTROLS */}
        <div className="space-y-6">

          {pipelineStep === "classified" ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-sm font-bold text-blue-300 mb-2">Schema Detected: {scannedMeta.schema}</h3>
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  Shinra has identified this file structure. We can automatically apply pre-labeling models to accelerate annotation.
                </p>
              </div>
              <button
                onClick={handleRunAIPreLabel}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition"
              >
                Initialize AI Pre-Labeling
              </button>
              <button onClick={() => setPipelineStep("prelabel")} className="w-full py-4 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:text-white transition">
                Skip AI (Manual)
              </button>
            </div>
          ) : pipelineStep === "prelabel" ? (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Campaign Title</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-white transition-colors outline-none"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Cost / Item</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-black border border-gray-800 p-3 text-sm focus:border-white transition-colors outline-none font-mono"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="p-4 border border-green-500/20 bg-green-900/10 text-xs text-green-300 leading-relaxed">
                <span className="font-bold">OPTIMIZATION:</span> Based on high AI confidence, we recommend reducing human verification to 10% of the dataset (`Consensus=1`).
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-green-500 text-black font-bold uppercase tracking-widest hover:bg-green-400 transition"
              >
                {submitting ? "Broadcasting..." : "Confirm & Launch Pipeline"}
              </button>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-xs font-mono uppercase tracking-widest">
              Waiting for Source Data...
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default PostTaskPage;
