from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI(title="Shinra Labs AI Control Plane")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class TaskRequest(BaseModel):
    description: str

class OrchestrationResponse(BaseModel):
    suggested_title: str
    task_type: str
    difficulty: str
    price: float
    estimated_time: str
    worker_count: int
    reasoning: str

class SubmissionRequest(BaseModel):
    submission_data: str
    task_type: str

class JudgeResponse(BaseModel):
    score: float
    confidence: str
    decision: str
    reasoning: str
    error_categories: List[str]
    improvement_suggestions: List[str]

class DatasetGenRequest(BaseModel):
    source_task_title: str
    task_type: str
    sample_count: int

class DatasetGenResponse(BaseModel):
    title: str
    description: str
    tags: List[str]
    use_cases: List[str]
    example_prompt: str
    readiness_score: int

# --- AI Logic (Mocked for Demo but Structured) ---

@app.post("/api/orchestrate", response_model=OrchestrationResponse)
async def orchestrate_task(request: TaskRequest):
    # Simulate AI processing
    time.sleep(1.5)
    
    desc = request.description.lower()
    
    if "image" in desc or "picture" in desc or "photo" in desc:
        t_type = "image"
        difficulty = "medium" if "complex" in desc else "easy"
        price = 7500.0 if difficulty == "medium" else 3000.0
        reasoning = "Detected visual context keywords. Complex pricing model applied due to potential ambiguity."
    elif "audio" in desc or "sound" in desc or "transcribe" in desc:
        t_type = "audio"
        difficulty = "hard"
        price = 12000.0
        reasoning = "Audio processing requires high-fidelity verification. Premium pricing suggested."
    else:
        t_type = "text"
        difficulty = "easy"
        price = 1500.0
        reasoning = "Standard text sentiment/classification task. Low complexity detected."

    return {
        "suggested_title": f"AI-Optimized: {t_type.capitalize()} Annotation Task",
        "task_type": t_type,
        "difficulty": difficulty,
        "price": price,
        "estimated_time": "24 hours",
        "worker_count": 5,
        "reasoning": reasoning
    }

@app.post("/api/judge", response_model=JudgeResponse)
async def judge_submission(request: SubmissionRequest):
    time.sleep(2) # Simulate deep analysis
    
    # Deterministic randomness based on length to keep it "stable" for same input
    seed = len(request.submission_data)
    random.seed(seed)
    
    score = random.uniform(0.60, 0.99)
    decision = "approved" if score > 0.85 else "rejected" if score < 0.70 else "rework"
    
    if decision == "approved":
        reasoning = "High alignment with Ground Truth. Consensus check passed with 98% overlap."
        errors = []
        suggestions = ["None. excellent quality."]
    elif decision == "rework":
        reasoning = "Minor inconsistencies found in edge cases. Review requested."
        errors = ["Label Ambiguity", "Bounding Box Drift"]
        suggestions = ["Tighten bounding boxes on occuluded objects."]
    else:
        reasoning = "Critical failure to follow guidelines. Significant deviation from consensus."
        errors = ["Missed Objects", "False Positives", "Class Confusion"]
        suggestions = ["Review annotation guidelines document v2.4."]

    confidence = "high" if score > 0.9 or score < 0.6 else "medium"

    return {
        "score": score,
        "confidence": confidence,
        "decision": decision,
        "reasoning": reasoning,
        "error_categories": errors,
        "improvement_suggestions": suggestions
    }

@app.post("/api/dataset/generate", response_model=DatasetGenResponse)
async def generate_dataset_meta(request: DatasetGenRequest):
    time.sleep(1)
    
    base_title = request.source_task_title.replace("Task", "").replace("AI-Optimized:", "").strip()
    
    return {
        "title": f"Shinra-Verified: {base_title} Dataset",
        "description": f"A premium, cleaned dataset derived from user submissions for '{base_title}'. Verified by Shinra AI Judge for high-fidelity ML training.",
        "tags": [request.task_type, "verified", "premium", "human-in-the-loop"],
        "use_cases": [
            "Fine-tuning LLMs", 
            "Computer Vision Object Detection", 
            "Sentiment Analysis"
        ],
        "example_prompt": f"Analyze the following {request.task_type} input and predict...",
        "readiness_score": 98
    }

@app.get("/api/reputation/{worker_id}")
async def get_reputation(worker_id: str):
    # Mock dynamic reputation
    return {
        "worker_id": worker_id,
        "trust_score": 92,
        "badges": ["Speed Demon", "Accuracy Expert", "Top 1%"],
        "summary": "This worker demonstrates exceptional consistency in image tagging tasks, though text submissions vary in quality. Recommended for high-priority visual tasks."
    }

@app.get("/")
def read_root():
    return {"status": "Shinra AI Control Plane Online"}
