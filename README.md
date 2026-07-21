# AI Interview Prep App

React Native (Expo) app + FastAPI backend for AI-driven mock interview practice.

## Structure

```
interview-prep-app/
├── backend/     FastAPI server — question generation + answer evaluation
└── mobile/      Expo React Native app
```

## Quick start

**1. Backend**
```bash
cd backend
python -m venv venv && source .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
export GROQ_API_KEY=your_key_here
uvicorn main:app --reload --port 8004
```

**2. Mobile app**
```bash
cd mobile
npm install
npx expo install react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npm start
```

Update `mobile/api/client.js` → `BASE_URL` to your machine's LAN IP (e.g. `http://192.168.1.x:8004`)
if testing on a physical device — `localhost` only works in the iOS simulator.

## What's included

- **Backend**: `/generate-questions` and `/evaluate-answer` endpoints, structured JSON output
  validated with Pydantic, ready to swap LLM providers. Question generation avoids repeating
  previously asked questions (per role) and varies angle/temperature each call for variety.
- **Mobile**: 5 screens — **Home** (dashboard with stats + recent sessions), **Practice Setup**,
  **Interview Session**, **Session Summary**, and **History** (full session log) — wired end-to-end
  to the backend. Session history and asked-questions are persisted locally via AsyncStorage, so
  they survive app restarts.

## What's not built yet (per the roadmap)

- Firebase Auth + Firestore (cloud-synced history instead of on-device only)
- Voice mode (react-native-voice + transcript pipeline)
- Filler-word counting

These are the natural next milestones — happy to build any of them next.
