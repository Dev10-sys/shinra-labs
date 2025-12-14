import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Activity, Users, Lock, ChevronRight } from 'lucide-react';

export default function PipelineSimulator({ baseCost, baseTasks, onUpdate }) {
    const [qualityLevel, setQualityLevel] = useState(98);
    const [consensus, setConsensus] = useState(2); // 1 = Single, 2 = Double, 3 = Tribunal
    const [workforce, setWorkforce] = useState('standard'); // standard, expert, master

    // LIVE CALCULATION
    const [simCost, setSimCost] = useState(baseCost);
    const [simTime, setSimTime] = useState(4); // Days
    const [simAccuracy, setSimAccuracy] = useState(98.5);

    useEffect(() => {
        // HEURISTIC FORMULA
        let costMulti = 1;
        let timeMulti = 1;
        let accBase = 95;

        // Consensus Impact
        costMulti *= (1 + (consensus - 1) * 0.8);
        timeMulti *= (1 + (consensus - 1) * 0.3);
        accBase += (consensus - 1) * 1.5;

        // Workforce Impact
        if (workforce === 'expert') { costMulti *= 1.5; timeMulti *= 0.8; accBase += 2; }
        if (workforce === 'master') { costMulti *= 3.0; timeMulti *= 1.2; accBase += 3.5; }

        // Quality Slider Impact (Checking)
        if (qualityLevel > 99) { costMulti *= 1.2; timeMulti *= 1.5; }

        setSimCost(Math.round(baseCost * costMulti));
        setSimTime(Math.max(1, Math.round(4 * timeMulti)));
        setSimAccuracy(Math.min(99.9, accBase));

        if (onUpdate) onUpdate({ cost: Math.round(baseCost * costMulti) });

    }, [qualityLevel, consensus, workforce, baseCost]);

    return (
        <div className="space-y-6 animate-fade-in">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
                    <Activity className="text-white w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Simulation Engine</h3>
                    <p className="text-[10px] text-gray-400">Optimize constraints before deployment.</p>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT: INPUTS */}
                <div className="space-y-6 bg-white/5 p-4 rounded-xl border border-white/10">

                    {/* CONSENSUS SLIDER */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Consensus Level</label>
                            <span className="text-xs text-indigo-400 font-mono">
                                {consensus === 1 ? 'Single Pass' : consensus === 2 ? 'Double Check' : 'Tribunal (3x)'}
                            </span>
                        </div>
                        <input
                            type="range" min="1" max="3" step="1"
                            value={consensus}
                            onChange={(e) => setConsensus(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-2">
                            Higher consensus reduces bias but multiplies cost.
                        </p>
                    </div>

                    {/* WORKFORCE TOGGLE */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Workforce Tier</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['standard', 'expert', 'master'].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setWorkforce(tier)}
                                    className={`py-2 text-[10px] uppercase font-bold border rounded transition-all ${workforce === tier ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0F1014] border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                >
                                    {tier}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QUALITY THRESHOLD */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min. Accuracy Target</label>
                            <span className="text-xs text-indigo-400 font-mono">{qualityLevel}%</span>
                        </div>
                        <input
                            type="range" min="90" max="99" step="1"
                            value={qualityLevel}
                            onChange={(e) => setQualityLevel(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                </div>

                {/* RIGHT: OUTPUTS */}
                <div className="space-y-4">

                    {/* COST CARD */}
                    <div className="p-4 bg-[#0F1014] border border-gray-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><TrendingUp size={12} /> Est. Cost</div>
                        <div className="text-2xl font-mono text-white">₹ {simCost.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-600 mt-1">vs Base: ₹ {baseCost.toLocaleString()}</div>
                    </div>

                    {/* TIME CARD */}
                    <div className="p-4 bg-[#0F1014] border border-gray-800 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Clock size={12} /> Est. Time</div>
                        <div className="text-2xl font-mono text-white">~{simTime} Days</div>
                    </div>

                    {/* ACCURACY PREDICTION */}
                    <div className="p-4 bg-[#0F1014] border border-gray-800 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Activity size={12} /> Predicted Quality</div>
                        <div className="text-2xl font-mono text-indigo-400">{simAccuracy}%</div>
                        <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${simAccuracy}%` }}></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
