import React, { useEffect, useState } from "react";

export default function DatasetPreviewModal({ dataset, onClose }) {
  const [aiMeta, setAiMeta] = useState(null);
  const [loadingAi, setLoadingAi] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!dataset) return;

    // Simulate generation or fetch from backend if already exists
    // For demo, we call the generation API to show it "working" live
    async function generateInsights() {
      setLoadingAi(true);
      try {
        const res = await fetch("/api/dataset/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_task_title: dataset.title,
            task_type: dataset.data_type || "text",
            sample_count: 500
          })
        });
        const data = await res.json();
        setAiMeta(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAi(false);
      }
    }
    generateInsights();
  }, [dataset]);

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

        {/* TABS */}
        <div className="flex border-b border-gray-800 mb-4">
          {['Overview', 'Readiness & Health', 'Lineage', 'Compatibility'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">

          {/**************** OVERVIEW TAB ****************/}
          {activeTab === 'Overview' && (
            <>
              {/* AI GENERATED INSIGHTS (Existing) */}
              <div className="p-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-lg">
                {/* ... (Existing AI Insight content) ... */}
                {/* Re-using existing structure but wrapped */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                    ✨ Shinra AI Insights
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Readiness Score</span>
                    <div className="text-lg font-mono text-white font-bold">
                      {aiMeta ? aiMeta.readiness_score : "..."}/100
                    </div>
                  </div>
                </div>

                {loadingAi ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-2 bg-indigo-500/20 rounded w-3/4"></div>
                  </div>
                ) : aiMeta ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Suggested Use Cases</span>
                      <div className="flex flex-wrap gap-2">
                        {aiMeta.use_cases?.map(uc => (
                          <span key={uc} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs rounded">
                            {uc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Example Prompt (Fine-Tuning)</span>
                      <div className="bg-black/50 p-2 rounded border border-white/5 font-mono text-[10px] text-gray-400">
                        {aiMeta.example_prompt}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-400">AI Analysis Unavailable</div>
                )}
              </div>

              {/* VISUAL SAMPLES */}
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">Data Samples</h4>
              {dataset.preview && dataset.preview.length > 0 ? (
                dataset.preview.map((item, i) => (
                  <div key={i} className="p-3 bg-[#1A1C23] rounded-lg border border-[#2A2D34] mb-2">
                    {item.image && <img src={item.image} alt="preview" className="w-full rounded mb-2" />}
                    {item.text && <p className="text-gray-200 mb-1">{item.text}</p>}
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Label: {item.label}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No preview samples available.</div>
              )}
            </>
          )}

          {/**************** READINESS & HEALTH TAB ****************/}
          {activeTab === 'Readiness & Health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#15161A] rounded-lg border border-gray-800">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Overall Quality</div>
                  <div className="text-2xl font-bold text-white flex items-center gap-2"> <CheckCircle className="text-green-500" size={20} /> 98.5%</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Bias Risk</div>
                  <div className="text-lg font-bold text-green-400 flex items-center justify-end gap-2"> <ShieldAlert size={16} /> Low</div>
                </div>
              </div>

              <div className="p-4 bg-[#15161A] rounded-lg border border-gray-800">
                <h4 className="text-sm font-semibold text-white mb-3">Class Balance</h4>
                {/* Simulating a bar chart */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-gray-400">Positive</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[60%]"></div>
                    </div>
                    <span className="w-8 text-right text-gray-300">60%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-gray-400">Negative</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[30%]"></div>
                    </div>
                    <span className="w-8 text-right text-gray-300">30%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-gray-400">Neutral</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500 w-[10%]"></div>
                    </div>
                    <span className="w-8 text-right text-gray-300">10%</span>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 text-[10px] text-yellow-400 bg-yellow-900/10 p-2 rounded border border-yellow-800/20">
                  <AlertTriangle size={12} className="mt-0.5" />
                  <span>Minor imbalance detected in 'Neutral' class. Recommended for sentiment analysis tasks requiring strong polarity.</span>
                </div>
              </div>
            </div>
          )}

          {/**************** LINEAGE TAB ****************/}
          {activeTab === 'Lineage' && (
            <div className="relative pl-4 border-l border-gray-700 space-y-6">
              {[
                { title: 'Raw Data Ingestion', date: '2025-01-10', icon: <GitPullRequest size={14} />, desc: 'Imported from public crawl #402' },
                { title: 'Automated Cleaning', date: '2025-01-12', icon: <Activity size={14} />, desc: 'Removed 14% duplicates and PII' },
                { title: 'Human Annotation', date: '2025-02-01', icon: <CheckCircle size={14} />, desc: '2 passes by expert labelers (Consensus: 99.2%)' },
                { title: 'Published', date: '2025-02-05', icon: <GitCommit size={14} />, desc: 'Version 1.0 released to marketplace' }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-0 bg-[#0F1014] p-1 border border-gray-700 rounded-full text-gray-400">
                    {step.icon}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <span className="text-[10px] text-gray-500">{step.date}</span>
                  <p className="text-xs text-gray-400 mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/**************** COMPATIBILITY TAB ****************/}
          {activeTab === 'Compatibility' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-900/20 text-green-500 mb-3 border border-green-500/20">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-white font-medium mb-1">100% Compatible</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                This dataset matches your Project "Vibe_Classification_v2" schema requirements.
              </p>

              <div className="mt-6 text-left bg-[#15161A] p-3 rounded-lg border border-gray-800 mx-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">JSONL / Image Folder</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Label Space</span>
                  <span className="text-white">Compatible (Superset)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Resolution</span>
                  <span className="text-white">Match (1024x1024)</span>
                </div>
              </div>
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
