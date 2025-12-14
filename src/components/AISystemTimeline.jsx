import React, { useEffect, useState } from "react";

const STEPS = [
    { label: "Task Ingested", sub: "User uploaded raw data via API", color: "text-gray-400", border: "border-gray-600" },
    { label: "AI Pricing Agent", sub: "Calculated complexity: High ($0.05/item)", color: "text-blue-400", border: "border-blue-500" },
    { label: "Worker Allocation", sub: "Distributed to 5 'S-Rank' Labelers", color: "text-purple-400", border: "border-purple-500" },
    { label: "AI Quality Judge", sub: "Verifying consensus (Confidence: 98%)", color: "text-yellow-400", border: "border-yellow-500", pulse: true },
    { label: "Dataset Generation", sub: "Pending final compilation...", color: "text-green-400", border: "border-green-500", pending: true }
];

export default function AISystemTimeline() {
    const [activeStep, setActiveStep] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % STEPS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="border border-white/10 bg-black p-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full"></span>
                Live Operations Timeline
            </h3>

            <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 z-0"></div>

                {STEPS.map((step, index) => {
                    const isActive = index === activeStep;
                    const isPast = index < activeStep;

                    return (
                        <div key={index} className={`relative z-10 flex gap-4 pb-6 last:pb-0 ${isActive ? "opacity-100" : "opacity-30"} transition-opacity duration-500`}>
                            {/* Dot */}
                            <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-2 ${isActive ? step.border + " bg-black" : "border-gray-800 bg-gray-900"} flex-shrink-0 transition-colors duration-300`}></div>

                            {/* Content */}
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-wide ${isActive ? step.color : "text-gray-500"}`}>
                                    {step.label}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                    {isActive ? step.sub : "..."}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
