import axios from "axios";

// Point this at your deployed backend, or your machine's LAN IP for local dev
// (localhost won't work from a physical device/emulator).
const BASE_URL = "https://interview-ai-assistant-b81x.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

export async function generateQuestions({
  role,
  experienceLevel,
  questionType,
  count = 5,
  avoidQuestions = [],
}) {
  const { data } = await api.post("/generate-questions", {
    role,
    experience_level: experienceLevel,
    question_type: questionType,
    count,
    avoid_questions: avoidQuestions,
  });
  return data.questions;
}

export async function evaluateAnswer({ question, answer, questionType = "behavioral" }) {
  const { data } = await api.post("/evaluate-answer", {
    question,
    answer,
    question_type: questionType,
  });
  return data;
}
