import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

/* ==================================================================================
   SHINRA LABS ONTOLOGY BUILDER
   - Manage classes/labels
   - AI Suggestions
   ================================================================================== */

function OntologyBuilder({ classes, setClasses, projectTitle, projectDesc }) {
    const [newClass, setNewClass] = useState("");
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleAddClass = (e) => {
        e.preventDefault();
        if (newClass.trim() && !classes.includes(newClass.trim())) {
            setClasses([...classes, newClass.trim()]);
            setNewClass("");
        }
    };

    const removeClass = (cls) => {
        setClasses(classes.filter(c => c !== cls));
    };

    const handleAISuggestValid = () => {
        setIsSuggesting(true);
        // Mock AI delay
        setTimeout(() => {
            const suggestions = getMockSuggestions(projectTitle, projectDesc, classes);
            // Only add unique ones
            const uniqueSuggestions = suggestions.filter(s => !classes.includes(s));
            setClasses([...classes, ...uniqueSuggestions]);
            setIsSuggesting(false);
        }, 1200);
    };

    const getMockSuggestions = (title, desc, currentClasses) => {
        const t = (title + " " + desc).toLowerCase();
        if (t.includes("car") || t.includes("vehicle") || t.includes("drive")) {
            return ["Pedestrian", "Traffic Light", "Stop Sign", "Truck", "Cyclist"];
        } else if (t.includes("medical") || t.includes("cancer") || t.includes("cell")) {
            return ["Benign Tumor", "Malignant Tumor", "Cell Nucleus", "White Blood Cell"];
        } else if (t.includes("retail") || t.includes("shelf") || t.includes("product")) {
            return ["Price Tag", "Brand Logo", "Out of Stock", "Product Item"];
        }
        // Fallback
        return ["Object A", "Object B", "Background"];
    };

    const checkOverlap = (cls) => {
        if (cls === 'Car' && classes.includes('Vehicle')) return 'Overlap: Subset of Vehicle';
        if (cls === 'Vehicle' && classes.includes('Car')) return 'Overlap: Superset of Car';
        return null;
    }

    const getConfidence = (cls) => {
        return (80 + (cls.length * 2) % 19);
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-end">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Ontology / Classes</label>
                <button
                    type="button"
                    onClick={handleAISuggestValid}
                    disabled={isSuggesting}
                    className="text-[10px] text-blue-400 font-mono hover:text-blue-300 transition flex items-center gap-1"
                >
                    {isSuggesting ? (
                        <>
                            <span className="animate-spin">⟳</span> GENERATING...
                        </>
                    ) : (
                        <>
                            <span>✨</span> AI SUGGEST CLASSES
                        </>
                    )}
                </button>
            </div>

            <div className="border border-white/20 p-4 bg-black min-h-[120px]">
                <div className="flex flex-wrap gap-2 mb-4">
                    {classes.map((cls, idx) => {
                        const warning = checkOverlap(cls);
                        const conf = getConfidence(cls);
                        return (
                            <div key={idx} className={`group relative bg-white/10 border ${warning ? 'border-yellow-500/50' : 'border-white/10'} px-3 py-1 text-sm flex items-center gap-2 hover:bg-white/20 transition cursor-default`}>
                                <span className="font-mono text-gray-300 group-hover:text-white">{cls}</span>

                                {/* CONFIDENCE INDICATOR */}
                                <div className="h-1 w-8 bg-gray-700 rounded-full overflow-hidden ml-1" title={`AI Confidence: ${conf}%`}>
                                    <div className="h-full bg-green-500" style={{ width: `${conf}%` }}></div>
                                </div>

                                {warning && <AlertCircle size={12} className="text-yellow-500" />}

                                <button
                                    onClick={() => removeClass(cls)}
                                    className="text-gray-500 hover:text-red-400 focus:outline-none ml-1"
                                >
                                    ×
                                </button>

                                {/* HOVER TOOLTIP */}
                                <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1A1C23] border border-white/20 p-3 text-[10px] text-gray-400 hidden group-hover:block z-50 shadow-xl rounded-lg">
                                    <div className="flex items-center gap-2 mb-2 text-white border-b border-white/10 pb-1">
                                        <CheckCircle2 size={10} className="text-green-500" /> AI Validated
                                        <span className="ml-auto flex items-center gap-1 text-green-400"><TrendingUp size={10} /> {conf}%</span>
                                    </div>
                                    <p className="mb-1">Definition: Standard class for {cls.toLowerCase()} detection.</p>
                                    {warning && (
                                        <div className="flex items-start gap-1 text-yellow-500 bg-yellow-900/10 p-1 rounded mt-1">
                                            <AlertCircle size={10} className="mt-0.5 shrink-0" />
                                            <span>{warning}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {classes.length === 0 && (
                        <span className="text-gray-600 text-sm italic py-1">No classes defined yet.</span>
                    )}
                </div>

                <form onSubmit={handleAddClass} className="relative">
                    <input
                        type="text"
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        placeholder="+ Add class (Press Enter)"
                        className="w-full bg-transparent border-b border-gray-800 pb-2 text-white focus:border-white focus:outline-none transition-colors text-sm"
                    />
                </form>
            </div>
        </div>
    );
}

export default OntologyBuilder;
