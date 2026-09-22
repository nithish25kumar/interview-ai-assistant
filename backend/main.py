"""
AI Interview Prep — FastAPI backend
Endpoints:
  POST /generate-questions  -> returns AI-generated interview questions
  POST /evaluate-answer     -> returns structured feedback on a candidate's answer
"""

import os
import json
import random
from typing import List, Optional, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq

load_dotenv()

app = FastAPI(title="AI Interview Prep API")

# Allow the Expo app (dev + prod) to call this API.
# Lock this down to your actual frontend origin(s) before shipping.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL = "openai/gpt-oss-20b"


# ---------- Request / Response schemas ----------

class GenerateQuestionsRequest(BaseModel):
    role: str = Field(..., examples=["Backend Engineer"])
    experience_level: Literal["intern", "junior", "mid", "senior"] = "junior"
    question_type: Literal["technical", "behavioral", "mixed"] = "mixed"
    count: int = Field(5, ge=1, le=15)
    avoid_questions: List[str] = Field(
        default_factory=list,
        description="Questions already asked in past sessions — the model should not repeat these.",
    )


class Question(BaseModel):
    question: str
    type: Literal["technical", "behavioral"]
    difficulty: Literal["easy", "medium", "hard"]


class GenerateQuestionsResponse(BaseModel):
    questions: List[Question]


class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    question_type: Literal["technical", "behavioral"] = "behavioral"


class Feedback(BaseModel):
    clarity_score: int = Field(..., ge=1, le=10)
    structure_score: int = Field(..., ge=1, le=10)
    completeness_score: int = Field(..., ge=1, le=10)
    used_star_method: Optional[bool] = None
    suggestions: List[str]
    stronger_phrasing_example: str


# ---------- Helpers ----------

def call_llm_for_json(prompt: str, temperature: float = 0.7) -> dict:
    """Call the LLM and parse a JSON object from its response."""
    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=1024,
        temperature=temperature,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.choices[0].message.content.strip()

    # Strip accidental markdown code fences before parsing.
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502, detail="Model did not return valid JSON."
        )


# ---------- Endpoints ----------

@app.post("/generate-questions", response_model=GenerateQuestionsResponse)
def generate_questions(req: GenerateQuestionsRequest):
    angle = random.choice([
        "with an emphasis on real-world scenarios and trade-offs",
        "with an emphasis on fundamentals and core concepts",
        "with an emphasis on debugging, edge cases, and failure modes",
        "with an emphasis on system design and architecture decisions",
        "with an emphasis on collaboration, communication, and past experience",
        "with an emphasis on recent industry practices and tooling",
    ])

    avoid_block = ""
    if req.avoid_questions:
        listed = "\n".join(f"- {q}" for q in req.avoid_questions[-30:])
        avoid_block = f"""
Do NOT reuse or closely rephrase any of these previously asked questions:
{listed}
"""

    prompt = f"""Generate {req.count} interview questions for a {req.experience_level}-level
{req.role} candidate. Question type focus: {req.question_type}, {angle}.
{avoid_block}
Vary the phrasing and specific scenarios each time this is called — do not default to the
most generic or commonly cited questions for this role.

Return ONLY a JSON object (no markdown, no preamble) in this exact shape:
{{
  "questions": [
    {{"question": "...", "type": "technical" | "behavioral", "difficulty": "easy" | "medium" | "hard"}}
  ]
}}"""

    data = call_llm_for_json(prompt, temperature=1.0)
    try:
        return GenerateQuestionsResponse(**data)
    except Exception:
        raise HTTPException(status_code=502, detail="Model response did not match expected schema.")


@app.post("/evaluate-answer", response_model=Feedback)
def evaluate_answer(req: EvaluateAnswerRequest):
    star_instruction = (
        'Also assess whether the answer follows the STAR method '
        '(Situation, Task, Action, Result) and set "used_star_method" accordingly.'
        if req.question_type == "behavioral"
        else 'Set "used_star_method" to null since this is a technical question.'
    )

    prompt = f"""You are an interview coach. Evaluate this candidate's answer.

Question: {req.question}
Answer: {req.answer}

Score clarity, structure, and completeness from 1-10. {star_instruction}
Give 2-3 specific, actionable suggestions. Provide one example of a stronger
phrasing for the weakest part of the answer.

Return ONLY a JSON object (no markdown, no preamble) in this exact shape:
{{
  "clarity_score": 1-10,
  "structure_score": 1-10,
  "completeness_score": 1-10,
  "used_star_method": true | false | null,
  "suggestions": ["...", "..."],
  "stronger_phrasing_example": "..."
}}"""

    data = call_llm_for_json(prompt)
    try:
        return Feedback(**data)
    except Exception:
        raise HTTPException(status_code=502, detail="Model response did not match expected schema.")


@app.get("/health")
def health():
    return {"status": "ok"}
