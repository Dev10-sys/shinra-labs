import React, { useEffect, useState } from 'react';

/* ==================================================================================
   SHINRA LABS PIPELINE IMPACT PREVIEW
   - Live calculations of cost, time, quality
   - Visual preview
   ================================================================================== */

function PipelineImpactPreview({ projectData, ontology }) {
    const [metrics, setMetrics] = useState({
        cost: 0,
        time: 0,
        quality: 98,
        readiness: 0
    });

    useEffect(() => {
        // RECALCULATE METRICS WHENEVER INPUTS CHANGE
        const calculateImpact = () => {
            const baseCost = projectData.dataType === 'image' ? 0.05 : 0.02;
            const ontologyFactor = Math.max(1, ontology.length * 0.1);
            const difficultyFactor = projectData.labelType === 'polygon' ? 1.5 : 1.0;

            // Mock volume based on no real data yet
            const volume = 1000;

            const estCost = volume * baseCost * ontologyFactor * difficultyFactor;
            const estTimeDays = (volume / 500) * difficultyFactor; // 500 tasks per day throughput

            // Readiness Logic
            let readiness = 0;
            if (projectData.title) readiness += 20;
            if (projectData.description) readiness += 20;
            if (ontology.length > 0) readiness += 40;
            if (projectData.dataType) readiness += 20;

            setMetrics({
                cost: estCost.toFixed(2),
                time: Math.ceil(estTimeDays),
                quality: 95 + (difficultyFactor > 1.2 ? -2 : 0), // Higher difficulty drops estimated quality slightly
                readiness: Math.min(100, readiness)
            });
        };

        calculateImpact();
    }, [projectData, ontology]);


    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Pipeline Impact Analysis</h3>

            {/* PREVIEW BOX */}
            <div className="aspect-video bg-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden group mb-6">
                {/* DYNAMIC BACKGROUND BASED ON TYPE */}
                <div className={`absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500 ${projectData.dataType === 'text'
                        ? "bg-[url('https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=2070')]"
                        : "bg-[url('https://images.unsplash.com/photo-1532009324734-20a7a5813719?q=80&w=2070')]"
                    }`}></div>

                <div className="relative z-10 text-center p-4">
                    {projectData.dataType === 'text' ? (
                        <div className="font-mono text-xs text-green-400 bg-black/80 p-2 border border-green-500/30">
                            "Analysis of {projectData.labelType} patterns..."
                        </div>
                    ) : (
                        <>
                            <div className="border-[1px] border-blue-500/50 w-32 h-24 mx-auto relative">
                                <span className="absolute -top-3 -left-1 bg-blue-600 text-[8px] font-bold px-1 text-white uppercase">
                                    {ontology[0] || "Object"}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-gray-500">
                    LIVE SIMULATION
                </div>
            </div>

            {/* LIVE METRICS */}
            <div className="space-y-4 flex-1">
                <div className="bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs text-gray-400 uppercase">Readiness</span>
                        <span className={`text-xs font-bold ${metrics.readiness === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {metrics.readiness}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-800 h-1">
                        <div
                            className={`h-1 transition-all duration-500 ${metrics.readiness === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${metrics.readiness}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Est. Cost (1k items)</div>
                            <div className="text-lg font-light text-white">
                                ${metrics.cost}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Est. Turnaround</div>
                            <div className="text-lg font-light text-white">
                                ~{metrics.time} Days
                            </div>
                        </div>
                    </div>
                </div>

                {/* QUALITY EXPLAINER */}
                <div className="border border-white/10 p-4 text-xs font-mono text-gray-400 relative group cursor-help">
                    <div className="flex justify-between mb-1">
                        <span>Expected Quality</span>
                        <span className="text-white">{metrics.quality}% IoU</span>
                    </div>
                    <p className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 right-0 bg-gray-800 p-2 border border-white/20 z-20 mt-1 shadow-lg text-[10px]">
                        Based on your ontology complexity ({ontology.length} classes) and data type, we predict a {metrics.quality}% intersection-over-union accuracy score.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PipelineImpactPreview;
