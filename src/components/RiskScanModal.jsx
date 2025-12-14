import React, { useEffect, useState } from 'react';

/* ==================================================================================
   SHINRA LABS RISK SCAN MODAL
   - Simulated AI Risk & Bias Scan
   ================================================================================== */

function RiskScanModal({ onClose, onProceed }) {
    const [scanStep, setScanStep] = useState(0);
    const [risks, setRisks] = useState([]);

    useEffect(() => {
        // Sequence of scanning animation
        const steps = [
            "Initializing Fairness Modules...",
            "Analyzing Class Distribution...",
            "Checking Demographic Visuals...",
            "Evaluating Sentiment Polarity...",
            "Generating Reliability Score..."
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setScanStep(currentStep);

            if (currentStep === 2) {
                setRisks(prev => [...prev, { level: 'low', msg: "Class Imbalance detected: 'Pedestrian' is underrepresented in sample." }]);
            }
            if (currentStep === 4) {
                setRisks(prev => [...prev, { level: 'medium', msg: "Potential lighting bias: 80% of samples are daylight." }]);
            }

            if (currentStep >= steps.length + 1) {
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const finished = scanStep > 5;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-black border border-white/20 w-full max-w-lg p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                    <span className="text-2xl">{finished ? '🛡️' : '📡'}</span>
                    {finished ? 'Risk & Bias Report' : 'Running AI Safety Scan...'}
                </h2>

                <div className="space-y-6">
                    {!finished ? (
                        <div className="space-y-4">
                            <div className="h-1 bg-gray-800 w-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
                            </div>
                            <div className="font-mono text-xs text-blue-400">
                                {scanStep < 5 ? ["Initializing...", "Analyzing Distribution...", "Checking Demographics...", "Evaluating Polarity...", "Finalizing..."][scanStep] : "Done."}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-900/10 border border-green-500/20 p-4">
                                <h4 className="text-green-400 text-sm font-bold mb-1">Passed Core Safety Checks</h4>
                                <p className="text-xs text-green-300/70">No critical NSFW or PII violations detected.</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detected Warnings</h4>
                                {risks.length > 0 ? risks.map((r, i) => (
                                    <div key={i} className={`p-3 border-l-2 text-xs font-mono ${r.level === 'medium' ? 'border-yellow-500 bg-yellow-500/5 text-yellow-200' : 'border-blue-500 bg-blue-500/5 text-blue-200'}`}>
                                        [{r.level.toUpperCase()}] {r.msg}
                                    </div>
                                )) : (
                                    <div className="text-xs text-gray-500 italic">None.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-white/20 text-gray-300 text-xs font-bold uppercase hover:bg-white/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onProceed}
                        disabled={!finished}
                        className="px-6 py-2 bg-white text-black text-xs font-bold uppercase hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {finished ? "Acknowledge & Deploy" : "Scanning..."}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RiskScanModal;
