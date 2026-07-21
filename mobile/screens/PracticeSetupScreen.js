import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { generateQuestions } from "../api/client";
import { getAskedQuestions, addAskedQuestions } from "../utils/storage";
import { colors, spacing, radius, type } from "../theme";

const EXPERIENCE_LEVELS = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
];

const QUESTION_TYPES = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "mixed", label: "Mixed" },
];

export default function PracticeSetupScreen({ navigation }) {
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("junior");
  const [questionType, setQuestionType] = useState("mixed");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleStart() {
    if (!role.trim()) {
      Alert.alert("Add a target role", "Enter the role you're preparing for to continue.");
      return;
    }
    setLoading(true);
    try {
      const avoidQuestions = await getAskedQuestions(role.trim());
      const questions = await generateQuestions({
        role: role.trim(),
        experienceLevel,
        questionType,
        count: 5,
        avoidQuestions,
      });
      await addAskedQuestions(role.trim(), questions.map((q) => q.question));
      navigation.navigate("InterviewSession", { questions, questionType, role: role.trim() });
    } catch (err) {
      Alert.alert(
        "Couldn't reach the server",
        "Check that the backend is running and reachable, then try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function Selector({ label, options, value, onChange }) {
    return (
      <View style={styles.selectorGroup}>
        <Text style={type.label}>{label}</Text>
        <View style={styles.optionsRow}>
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => onChange(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={type.eyebrow}>Practice session</Text>
      <Text style={[type.title, styles.title]}>Set up your mock interview</Text>
      <Text style={[type.subtitle, styles.subtitle]}>
        Tell us the role and we'll generate tailored questions.
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={type.label}>Target role</Text>
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="e.g. Backend Engineer"
          placeholderTextColor={colors.muted}
          value={role}
          onChangeText={setRole}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>

      <Selector
        label="Experience level"
        options={EXPERIENCE_LEVELS}
        value={experienceLevel}
        onChange={setExperienceLevel}
      />

      <Selector
        label="Question type"
        options={QUESTION_TYPES}
        value={questionType}
        onChange={setQuestionType}
      />

      <TouchableOpacity
        style={[styles.startButton, loading && styles.startButtonDisabled]}
        onPress={handleStart}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.startButtonText}>Start practice</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  title: { marginTop: spacing.xs, marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.xxl },
  fieldGroup: { marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.amber,
  },
  selectorGroup: { marginBottom: spacing.xl },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.navySoft,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.navy,
  },
  chipText: { color: colors.inkSoft, fontSize: 14, fontWeight: "600" },
  chipTextSelected: { color: colors.surface },
  startButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  startButtonDisabled: { opacity: 0.7 },
  startButtonText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
});
