# Backend — AI Interview Prep API

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file (or export directly) with your API key (get one free at console.groq.com):

```
GROQ_API_KEY=your_key_here
```

## Run locally

```bash
uvicorn main:app --reload --port 8004
```

API is now live at `http://localhost:8004`. Interactive docs at `http://localhost:8004/docs`.

## Endpoints

- `POST /generate-questions` — body: `{ "role": "Backend Engineer", "experience_level": "junior", "question_type": "mixed", "count": 5 }`
- `POST /evaluate-answer` — body: `{ "question": "...", "answer": "...", "question_type": "behavioral" }`
- `GET /health` — sanity check

## Note on LLM provider

This uses the Groq API (`llama-3.3-70b-versatile`) — fast inference and a generous free tier, good for demos. If you'd rather use OpenAI, Anthropic, or Gemini instead, swap the `call_llm_for_json` function in `main.py` — the rest of the app (schemas, endpoints) stays identical.

## Deploy

Render or Railway both have free tiers that work well for a demo:
1. Push this `backend/` folder to a GitHub repo
2. Connect the repo on Render/Railway, set the `GROQ_API_KEY` env var in their dashboard
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
