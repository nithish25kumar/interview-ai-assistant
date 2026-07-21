import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSIONS_KEY = "interview_prep_sessions";
const ASKED_QUESTIONS_KEY = "interview_prep_asked_questions";

// ---------- Session history ----------

export async function getSessions() {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSession(session) {
  const sessions = await getSessions();
  const updated = [session, ...sessions].slice(0, 50); // cap history length
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearSessions() {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}

// ---------- Asked-questions tracking (per role) ----------
// Keeps a rolling list of questions already asked for a given role so the
// backend can be told to avoid repeating them.

export async function getAskedQuestions(role) {
  const raw = await AsyncStorage.getItem(ASKED_QUESTIONS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  return all[normalizeRole(role)] || [];
}

export async function addAskedQuestions(role, questions) {
  const raw = await AsyncStorage.getItem(ASKED_QUESTIONS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  const key = normalizeRole(role);
  const existing = all[key] || [];
  all[key] = [...existing, ...questions].slice(-60); // keep last 60 per role
  await AsyncStorage.setItem(ASKED_QUESTIONS_KEY, JSON.stringify(all));
}

function normalizeRole(role) {
  return role.trim().toLowerCase();
}
