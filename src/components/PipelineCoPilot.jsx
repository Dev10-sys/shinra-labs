import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Zap, Cpu } from 'lucide-react';

export default function PipelineCoPilot({ projectData, ontology, onApplySuggestion }) {
    const [suggestions, setSuggestions] = useState([]);
    const [warnings, setWarnings] = useState([]);

    useEffect(() => {
        // ANALYZE INPUTS LIVE
        const newSuggestions = [];
        const newWarnings = [];
        const title = projectData.title ? projectData.title.toLowerCase() : "";
        const description = projectData.description ? projectData.description.toLowerCase() : "";

        // 1. Modality Mismatch
        if (title.includes("audio") && projectData.dataType !== "audio") {
            newSuggestions.push({
                id: "fix_modality_audio",
                type: "fix",
                text: "Title suggests Audio modality.",
                actionLabel: "Switch to Audio",
                payload: { dataType: "audio", labelType: "transcription" }
            });
        }

        // 2. Ontology Checks
        if (ontology.length > 0) {
            // Class Mismatch
            if (projectData.dataType === "image" && ontology.includes("Positive")) {
                newWarnings.push("Sentiment labels ('Positive') are unusual for Image tasks.");
            }

            // Overlap Detection
            if (ontology.includes("Car") && ontology.includes("Vehicle")) {
                newWarnings.push("Ontology Overlap: 'Car' is a subset of 'Vehicle'. merging recommended.");
            }
        } else if (title.length > 5) {
            newSuggestions.push({
                id: "suggest_classes",
                type: "insight",
                text: "AI can generate class labels based on your title.",
                actionLabel: "Generate Classes",
                payload: { type: "generate_classes" }
            });
        }

        // 3. Description Analysis
        if (description.length > 0 && description.length < 20) {
            newWarnings.push("Description is too short for high-quality Human-in-the-Loop results.");
        }

        setSuggestions(newSuggestions);
        setWarnings(newWarnings);

    }, [projectData, ontology]);

    return (
        <div className="bg-[#15161A] border border-gray-800 rounded-xl overflow-hidden sticky top-8 animate-slide-in-right">
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Cpu className="text-indigo-400 w-5 h-5 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">SHINRA CO-PILOT</h3>
                    <div className="text-[10px] text-indigo-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Monitoring Configuration
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* SUGGESTIONS */}
                {suggestions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-widest flex items-center gap-2">
                            <Lightbulb size={12} /> Suggestions
                        </h4>
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                <p className="text-xs text-indigo-200 mb-2">{s.text}</p>
                                {s.actionLabel && (
                                    <button
                                        onClick={() => onApplySuggestion(s)}
                                        className="text-[10px] bg-indigo-500 hover:bg-indigo-400 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                    >
                                        <Zap size={10} fill="currentColor" /> {s.actionLabel}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* WARNINGS */}
                {warnings.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-widest flex items-center gap-2">
                            <AlertTriangle size={12} /> Risks Detected
                        </h4>
                        {warnings.map((w, i) => (
                            <div key={i} className="flex gap-2 items-start p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                                <AlertTriangle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-300 leading-snug">{w}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* DEFAULT STATE */}
                {suggestions.length === 0 && warnings.length === 0 && (
                    <div className="text-center py-6 opacity-50">
                        <CheckCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Configuration looks solid.</p>
                    </div>
                )}

                {/* CONTEXTUAL HELP */}
                <div className="pt-4 border-t border-white/5">
                    <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-2">
                        Active Config
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Modality</span>
                            <span className="text-white font-mono">{projectData.dataType}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Labeling</span>
                            <span className="text-white font-mono">{projectData.labelType}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Classes</span>
                            <span className="text-white font-mono">{ontology.length}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
