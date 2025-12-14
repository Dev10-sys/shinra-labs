import React, { useState } from 'react';
import { Sparkles, ArrowRight, Search, CheckCircle } from 'lucide-react';

export default function DatasetAdvisor({ onRecommend }) {
    const [modelType, setModelType] = useState('nlp');
    const [useCase, setUseCase] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    const handleAskAI = () => {
        if (!useCase) return;
        setAnalyzing(true);
        setRecommendation(null);

        // Mock AI Delay
        setTimeout(() => {
            setAnalyzing(false);

            // Mock Logic based on keywords
            let reason = "Based on your focus on general purpose tasks, we recommend waiting for more specific diverse datasets.";
            let suggestedIds = [];

            const lowerCase = useCase.toLowerCase();

            if (lowerCase.includes("traffic") || lowerCase.includes("car") || lowerCase.includes("drive")) {
                reason = "Detected autonomous driving context. 'Indian Traffic Signs' is the highest match due to its specialized bounding box annotations.";
                suggestedIds = ["sys_1", "sys_4"];
            } else if (lowerCase.includes("medical") || lowerCase.includes("health") || lowerCase.includes("doctor")) {
                reason = "For healthcare applications, verified professional transcripts are critical. 'Medical Conversational Audio' offers high-fidelity doctor-patient logs.";
                suggestedIds = ["sys_2"];
            } else if (lowerCase.includes("shop") || lowerCase.includes("sentiment") || lowerCase.includes("customer")) {
                reason = "E-commerce analysis requires diverse consumer vocabulary. The 'E-Commerce Sentiment Corpus' covers wide regional slang variants.";
                suggestedIds = ["sys_3"];
            } else {
                reason = "Based on your general description, we recommend starting with a versatile dataset. 'E-Commerce Sentiment Corpus' is a good baseline for general NLP.";
                suggestedIds = ["sys_3"];
            }

            setRecommendation({
                confidence: 94,
                reason: reason,
                suggestedIds: suggestedIds
            });

            if (onRecommend) onRecommend(suggestedIds);

        }, 1500);
    };

    return (
        <div className="w-full p-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-xl mb-8">
            <div className="bg-[#0F1014] rounded-lg p-6 relative overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Shinra AI Dataset Advisor</h3>
                    </div>

                    <div className="grid md:grid-cols-[1fr,1.5fr,auto] gap-4 items-end">

                        {/* Model Type Input */}
                        <div>
                            <label className="block text-[10px] uppercase text-gray-500 tracking-wider mb-2">Target Model</label>
                            <select
                                value={modelType}
                                onChange={(e) => setModelType(e.target.value)}
                                className="w-full bg-[#1A1C23] border border-[#2A2D34] text-gray-200 text-sm rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="nlp">LLM / NLP</option>
                                <option value="cv">Computer Vision</option>
                                <option value="audio">Audio / Speech</option>
                                <option value="tabular">Tabular / Structured</option>
                            </select>
                        </div>

                        {/* Use Case Input */}
                        <div>
                            <label className="block text-[10px] uppercase text-gray-500 tracking-wider mb-2">Use Case Description</label>
                            <input
                                type="text"
                                value={useCase}
                                onChange={(e) => setUseCase(e.target.value)}
                                placeholder="e.g. 'Detecting traffic signs in Mumbai' or 'Analyzing customer support calls'..."
                                className="w-full bg-[#1A1C23] border border-[#2A2D34] text-white text-sm rounded-lg p-3 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAskAI}
                            disabled={analyzing || !useCase}
                            className={`h-[46px] px-6 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${analyzing
                                    ? "bg-indigo-900/50 text-indigo-400 cursor-not-allowed"
                                    : !useCase
                                        ? "bg-[#1A1C23] text-gray-500 cursor-not-allowed"
                                        : "bg-white text-black hover:bg-indigo-50 shadow-lg hover:shadow-indigo-500/20"
                                }`}
                        >
                            {analyzing ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    Find Best Fit <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* AI Output Section */}
                    {(recommendation || analyzing) && (
                        <div className={`mt-6 pt-6 border-t border-gray-800 transition-all duration-500 ${analyzing ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-medium text-indigo-300">Analysis Complete</span>
                                        {recommendation && (
                                            <span className="text-[10px] px-2 py-0.5 bg-green-900/40 text-green-400 border border-green-500/30 rounded-full">
                                                {recommendation.confidence}% Confidence
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {recommendation ? recommendation.reason : "Analyzing your requirements against 14,000+ datasets..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
