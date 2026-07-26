from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

profile = {
    "heroTitle": "关于我",
    "heroSubtitle": "项目，创意，灵感，心得，我的作品",
}

class AnalysisRequest(BaseModel):
    text: str

@app.get("/api/profile")
def get_profile():
    return profile

@app.post("/api/analyze")
def analyze(req:AnalysisRequest):  
    return {
        "text": req.text,
        "score": 0.5,
        "label": "peaceful",
        "pinyin":"wait session 6",
    }
