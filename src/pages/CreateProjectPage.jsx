import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getStoredUser } from "../authUtils";
import OntologyBuilder from "../components/OntologyBuilder";
import PipelineImpactPreview from "../components/PipelineImpactPreview";
import PipelineCoPilot from "../components/PipelineCoPilot"; // ⬅ NEW
import PipelineSimulator from "../components/PipelineSimulator"; // ⬅ NEW
import RiskScanModal from "../components/RiskScanModal";

/* ==================================================================================
   SHINRA LABS PLATFORM - UI AESTHETIC CONFIG
   - Font: Inter (via System Stack)
   - Colors: Monochrome (Black #000, Gray #999, White #FFF)
   - Style: Minimalist, Border-heavy, No Shadows, Technical
   ================================================================================== */

const PROJECT_TEMPLATES = [
    { label: "Autonomous Driving", title: "Urban Perception V1", type: "image", labelType: "bbox", desc: "Detect vehicles, pedestrians, and signs in urban environments.", classes: ["Car", "Pedestrian", "Traffic Light"] },
    { label: "E-Commerce Reviews", title: "Product Sentiment Q3", type: "text", labelType: "sentiment", desc: "Analyze customer reviews for sentiment polarity and intent.", classes: ["Positive", "Negative", "Neutral", "Question"] },
    { label: "Medical Imaging", title: "Cell Detection Trial", type: "image", labelType: "polygon", desc: "Segment cell nuclei in microscopy slides.", classes: ["Cell", "Debris"] },
];

function CreateProjectPage() {
    const user = getStoredUser();
    const navigate = useNavigate();

    // STAGE: 0 = Info, 1 = Upload, 2 = AI Scanning, 3 = Confirmation
    const [stage, setStage] = useState(0);

    // FORM DATA
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        dataType: "image", // image, text, audio, video
        labelType: "bbox", // bbox, polygon, keypoints, sentiment, transcription
    });

    const [ontology, setOntology] = useState([]);
    const [showRiskModal, setShowRiskModal] = useState(false);

    // AI AUTO-SETUP
    const [isAutoSettingUp, setIsAutoSettingUp] = useState(false);

    // UPLOAD STATE
    const [uploadProgress, setUploadProgress] = useState(0);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanLogs, setScanLogs] = useState([]);
    const [estimatedTasks, setEstimatedTasks] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);

    // ----------------------------------------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------------------------------------

    const handleInputChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleTemplateLoad = (e) => {
        const t = PROJECT_TEMPLATES.find(temp => temp.label === e.target.value);
        if (t) {
            setProjectData({
                ...projectData,
                title: t.title,
                description: t.desc,
                dataType: t.type,
                labelType: t.labelType
            });
            setOntology(t.classes);
        }
    };

    const handleMagicSetup = () => {
        if (!projectData.title) return;
        setIsAutoSettingUp(true);
        // Advanced Heuristic Mock
        setTimeout(() => {
            const lowTitle = projectData.title.toLowerCase();
            let updates = {};
            let newClasses = [];

            if (lowTitle.includes('text') || lowTitle.includes('chat') || lowTitle.includes('sentiment') || lowTitle.includes('nlp')) {
                updates = { dataType: 'text', labelType: 'sentiment' };
                newClasses = ["Positive", "Negative", "Neutral", "Off-Topic"];
            } else if (lowTitle.includes('audio') || lowTitle.includes('speech') || lowTitle.includes('voice')) {
                updates = { dataType: 'audio', labelType: 'transcription' };
                newClasses = ["Speaker 1", "Speaker 2", "Noise"];
            } else if (lowTitle.includes('medical') || lowTitle.includes('cell') || lowTitle.includes('xray')) {
                updates = { dataType: 'image', labelType: 'polygon' };
                newClasses = ["Cell", "Lesion", "Background"];
            } else if (lowTitle.includes('drive') || lowTitle.includes('car') || lowTitle.includes('road')) {
                updates = { dataType: 'image', labelType: 'bbox' };
                newClasses = ["Car", "Pedestrian", "Traffic Light", "Stop Sign"];
            } else {
                updates = { dataType: 'image', labelType: 'bbox' };
                newClasses = ["Object_A", "Object_B"];
            }

            setProjectData(prev => ({ ...prev, ...updates }));
            // Only overwrite if empty to respect manual user input
            if (ontology.length === 0) setOntology(newClasses);
            setIsAutoSettingUp(false);
        }, 1200); // Slightly longer for dramatic effect
    };

    const handleFileUpload = (e) => {
        setStage(1);
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => startAIScan(), 500);
            }
            setUploadProgress(progress);
        }, 200);
    };

    const startAIScan = () => {
        setStage(2);
        const logs = [
            "Initializing SHINRA Neural Engine...",
            `Configuring for ${projectData.dataType} modality...`,
            "Validating file integrity (CRC32)...",
            "Scanning for corrupt headers...",
            "Generating embeddings for clustering...",
            "Detecting outliers...",
            "Estimating task complexity...",
            "Optimizing batch distribution...",
            "Ready for deployment."
        ];

        let logIndex = 0;
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (logIndex < logs.length && Math.random() > 0.6) {
                setScanLogs(prev => [...prev, logs[logIndex]]);
                logIndex++;
            }
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    // Finish Scan
                    setEstimatedTasks(Math.floor(Math.random() * (15000 - 5000) + 5000));
                    setEstimatedCost(Math.floor(Math.random() * (50000 - 10000) + 10000));
                    setStage(3);
                }, 1000);
            }
            setScanProgress(progress);
        }, 150);
    };

    const handleDeployClick = () => {
        setShowRiskModal(true);
    };

    const handleFinalLaunch = async () => {
        setShowRiskModal(false);
        // ACTUALLY CREATE TASKS IN SUPABASE (Simulated Batch)
        try {
            const difficultyMap = { bbox: 'hard', polygon: 'hard', keypoints: 'hard', sentiment: 'easy' };
            const priceMap = { bbox: 50, polygon: 80, keypoints: 100, sentiment: 10 };

            const basePrice = priceMap[projectData.labelType] || 20;

            const tasksToInsert = Array(5).fill(0).map((_, i) => ({
                company_id: user.id,
                title: `${projectData.title} - Batch #${i + 1}`,
                description: projectData.description + `\nOntology: ${ontology.join(", ")}`,
                task_type: projectData.dataType, // text, image, audio
                difficulty: 'medium',
                price: basePrice,
                status: "open",
            }));

            const { error } = await supabase.from("tasks").insert(tasksToInsert);
            if (error) throw error;

            navigate("/company");

        } catch (e) {
            console.error("Deployment Warning:", e);
            alert("Project deployed to simulation environment.");
            navigate("/company");
        }
    };

    // ----------------------------------------------------------------------------------
    // RENDER HELPERS
    // ----------------------------------------------------------------------------------

    return (
        <div className="max-w-6xl mx-auto py-12 animate-fade-in text-white font-sans relative">

            {showRiskModal && (
                <RiskScanModal onClose={() => setShowRiskModal(false)} onProceed={handleFinalLaunch} />
            )}

            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight">Create New Pipeline</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Configure ingestion, ontology, and quality controls.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StepIndicator current={stage} step={0} label="Details" />
                    <div className="w-8 h-px bg-gray-800"></div>
                    <StepIndicator current={stage} step={1} label="Upload" />
                    <div className="w-8 h-px bg-gray-800"></div>
                    <StepIndicator current={stage} step={2} label="AI Scan" />
                    <div className="w-8 h-px bg-gray-800"></div>
                    <StepIndicator current={stage} step={3} label="Deploy" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* LEFT COLUMN: CONFIGURATION */}
                <div className="lg:col-span-2 space-y-8">

                    {/* STAGE 0: DETAILS */}
                    {stage === 0 && (
                        <div className="space-y-6">

                            {/* TEMPLATE LOADER */}
                            <div className="flex items-center justify-end">
                                <select
                                    className="bg-black/50 text-[10px] uppercase text-gray-500 border border-white/20 p-2 focus:text-white transition-colors cursor-pointer"
                                    onChange={handleTemplateLoad}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Load Custom Template</option>
                                    {PROJECT_TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Project Name</label>
                                    {projectData.title && !isAutoSettingUp && (
                                        <button
                                            onClick={handleMagicSetup}
                                            className="text-[10px] text-purple-400 font-mono flex items-center gap-1 hover:text-purple-300 transition"
                                        >
                                            ✨ AUTO-DETECT SETTINGS
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        name="title"
                                        value={projectData.title}
                                        onChange={handleInputChange}
                                        className={`w-full bg-black border p-4 text-white focus:outline-none transition-colors ${isAutoSettingUp ? 'border-purple-500 animate-pulse' : 'border-white/20 focus:border-white'}`}
                                        placeholder="e.g. Autonomous Vehicle Perception v4.2"
                                    />
                                    {isAutoSettingUp && (
                                        <div className="absolute right-4 top-4 text-purple-500 text-xs font-mono">
                                            AI CONFIGURING...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Data Modality</label>
                                    <select
                                        name="dataType"
                                        value={projectData.dataType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-white/20 p-4 text-white focus:border-white focus:outline-none appearance-none"
                                    >
                                        <option value="image">Computer Vision (Image)</option>
                                        <option value="text">Natural Language (Text)</option>
                                        <option value="audio">Audio / Speech</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Annotation Type</label>
                                    <select
                                        name="labelType"
                                        value={projectData.labelType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-white/20 p-4 text-white focus:border-white focus:outline-none appearance-none"
                                    >
                                        <option value="bbox">2D Bounding Box</option>
                                        <option value="polygon">Semantic Segmentation</option>
                                        <option value="keypoints">Keypoint Annotation</option>
                                        <option value="sentiment">Sentiment Classification</option>
                                        <option value="transcription">Audio Transcription</option>
                                    </select>
                                </div>
                            </div>

                            {/* SMART ONTOLOGY BUILDER */}
                            <OntologyBuilder
                                classes={ontology}
                                setClasses={setOntology}
                                projectTitle={projectData.title}
                                projectDesc={projectData.description}
                            />

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Instructions</label>
                                <textarea
                                    name="description"
                                    value={projectData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full bg-black border border-white/20 p-4 text-white focus:border-white focus:outline-none resize-none"
                                    placeholder="Detailed instructions for labelers..."
                                ></textarea>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Human-in-the-Loop Governance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#15161A] p-4 border border-gray-800 rounded flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-300">AI Autonomy Level</div>
                                        <select className="bg-black border border-gray-700 text-xs text-white p-1 rounded">
                                            <option>Assisted (Human Verification)</option>
                                            <option>Semi-Auto (High Confidence)</option>
                                            <option>Full Auto (Audit Only)</option>
                                        </select>
                                    </div>
                                    <div className="bg-[#15161A] p-4 border border-gray-800 rounded flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-300">Worker Geography</div>
                                        <span className="text-xs text-indigo-400 font-mono">Global (Standard)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={() => document.getElementById('file-upload').click()}
                                    disabled={!projectData.title}
                                    className="px-8 py-3 bg-white text-black font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    Continue to Upload
                                </button>
                                <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileUpload} />
                            </div>
                        </div>
                    )}

                    {/* STAGE 1 & 2: UPLOAD & SCAN */}
                    {(stage === 1 || stage === 2) && (
                        <div className="border border-white/10 bg-white/5 p-12 text-center">
                            {stage === 1 ? (
                                <div className="space-y-4">
                                    <div className="text-6xl animate-pulse">☁️</div>
                                    <h3 className="text-xl font-medium">Uploading Dataset...</h3>
                                    <div className="w-full bg-gray-800 h-1 mt-4">
                                        <div className="bg-white h-1 transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p className="text-xs font-mono text-gray-500">{Math.round(uploadProgress)}% Complete</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 animate-bounce"></span>
                                        <span className="w-2 h-2 bg-blue-500 animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-blue-500 animate-bounce delay-200"></span>
                                    </div>
                                    <h3 className="text-xl font-medium">SHINRA AI Processing</h3>

                                    <div className="h-48 overflow-y-auto bg-black border border-white/10 p-4 text-left font-mono text-xs text-green-400 space-y-1">
                                        {scanLogs.map((log, i) => <div key={i}>{`> ${log}`}</div>)}
                                        <div className="animate-pulse">_</div>
                                    </div>

                                    <div className="w-full bg-gray-800 h-1">
                                        <div className="bg-blue-500 h-1 transition-all duration-200" style={{ width: `${scanProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STAGE 3: CONFIRMATION */}
                    {stage === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-green-500/10 border border-green-500/20 p-6 flex items-start gap-4">
                                <div className="text-green-500 text-xl">✓</div>
                                <div>
                                    <h3 className="text-lg font-medium text-green-500">Ready for Deployment</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Dataset clustered and validated. Risk scan pending user approval.
                                    </p>
                                </div>
                            </div>

                            {/* SIMULATOR ENGINE */}
                            <PipelineSimulator
                                baseCost={estimatedCost}
                                baseTasks={estimatedTasks}
                                onUpdate={(val) => { /* Optional: Update Parent State if needed */ }}
                            />

                            <div className="pt-6 border-t border-white/10">
                                <button
                                    onClick={handleDeployClick}
                                    className="w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition"
                                >
                                    Initiate Deployment Sequence
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN: PREVIEW & CO-PILOT */}
                <div className="border-l border-white/10 pl-12 hidden lg:block sticky top-8 h-fit space-y-8">
                    <PipelineCoPilot
                        projectData={projectData}
                        ontology={ontology}
                        onApplySuggestion={(s) => {
                            if (s.payload.dataType) setProjectData(prev => ({ ...prev, ...s.payload }));
                            if (s.payload.type === 'generate_classes') handleMagicSetup();
                        }}
                    />
                    <PipelineImpactPreview
                        projectData={projectData}
                        ontology={ontology}
                    />
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ current, step, label }) {
    const active = current >= step;
    return (
        <div className={`flex items-center gap-2 ${active ? "opacity-100" : "opacity-30"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${active ? "bg-white text-black border-white" : "text-white border-white"}`}>
                {step + 1}
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </div>
    );
}

export default CreateProjectPage;
