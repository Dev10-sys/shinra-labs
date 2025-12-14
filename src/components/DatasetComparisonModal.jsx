import React from 'react';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DatasetComparisonModal({ selectedDatasets, onClose }) {
    if (!selectedDatasets || selectedDatasets.length === 0) return null;

    // Mock Data Generators for missing fields
    const getQualityScore = (id) => 85 + (id.length * 2) % 15;
    const getBiasRisk = (id) => (id.charCodeAt(0) % 3 === 0 ? "Medium" : "Low");
    const getUpdateFreq = (id) => (id.charCodeAt(1) % 2 === 0 ? "Weekly" : "Monthly");

    const properties = [
        { label: "Price", key: "price", render: d => `₹${d.price}` },
        { label: "Data Type", key: "data_type", render: d => <span className="uppercase">{d.data_type}</span> },
        {
            label: "Quality Score", key: "quality", render: d => (
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-16 rounded-full ${getQualityScore(d.id) > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span>{getQualityScore(d.id)}/100</span>
                </div>
            )
        },
        {
            label: "Bias Risk", key: "bias", render: d => {
                const risk = getBiasRisk(d.id);
                return (
                    <span className={`flex items-center gap-1 ${risk === 'Low' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {risk === 'Low' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />} {risk}
                    </span>
                )
            }
        },
        { label: "Update Freq.", key: "freq", render: d => getUpdateFreq(d.id) },
        { label: "Licensing", key: "license", render: () => "Commercial" },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-[#0F1014] border border-[#1E1F23] rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Compare Datasets</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable Table */}
                <div className="overflow-auto flex-1 p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 w-48 text-gray-500 text-xs uppercase tracking-wider sticky top-0 bg-[#0F1014] z-10">Feature</th>
                                {selectedDatasets.map(ds => (
                                    <th key={ds.id} className="p-4 min-w-[200px] sticky top-0 bg-[#0F1014] z-10 border-b border-gray-800">
                                        <div className="text-white font-medium text-lg leading-tight mb-1">{ds.title}</div>
                                        <div className="text-gray-500 text-xs font-normal line-clamp-1">{ds.description}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {properties.map(prop => (
                                <tr key={prop.label} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400 text-sm font-medium">{prop.label}</td>
                                    {selectedDatasets.map(ds => (
                                        <td key={ds.id + prop.label} className="p-4 text-gray-200 text-sm">
                                            {prop.render(ds)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td className="p-4 text-gray-400 text-sm font-medium align-top pt-6">Action</td>
                                {selectedDatasets.map(ds => (
                                    <td key={ds.id + 'action'} className="p-4 pt-6">
                                        <button className="w-full py-2 px-3 bg-white text-black rounded-lg hover:bg-gray-200 transition duration-200 font-semibold text-sm shadow-md">
                                            Buy for ₹{ds.price}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
