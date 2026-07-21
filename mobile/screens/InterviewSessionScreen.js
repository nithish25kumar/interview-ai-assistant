import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { evaluateAnswer } from "../api/client";
import { colors, spacing, radius, type } from "../theme";

function ProgressDots({ total, current }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current && styles.dotActive,
            i < current && styles.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

function TypeBadge({ label }) {
  const isTechnical = label === "technical";
  return (
    <View style={[styles.badge, isTechnical ? styles.badgeNavy : styles.badgeAmber]}>
      <Text style={[styles.badgeText, isTechnical ? styles.badgeTextNavy : styles.badgeTextAmber]}>
        {label}
      </Text>
    </View>
  );
}

export default function InterviewSessionScreen({ route, navigation }) {
  const { questions, questionType, role } = route.params;

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);

  const currentQuestion = questions[index];
  const isLastQuestion = index === questions.length - 1;

  async function handleSubmit() {
    if (!answer.trim()) {
      Alert.alert("Add your answer", "Type a response before submitting.");
      return;
    }
    setLoading(true);
    try {
      const feedback = await evaluateAnswer({
        question: currentQuestion.question,
        answer: answer.trim(),
        questionType: currentQuestion.type || questionType,
      });

      const updatedResults = [
        ...results,
        { question: currentQuestion.question, answer: answer.trim(), feedback },
      ];
      setResults(updatedResults);
      setAnswer("");

      if (isLastQuestion) {
        navigation.navigate("SessionSummary", { results: updatedResults, role });
      } else {
        setIndex(index + 1);
      }
    } catch (err) {
      Alert.alert("Couldn't submit answer", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProgressDots total={questions.length} current={index} />
      <Text style={styles.progressLabel}>
        Question {index + 1} of {questions.length}
      </Text>

      <View style={styles.badgeRow}>
        <TypeBadge label={currentQuestion.type || questionType} />
        <Text style={styles.difficulty}>{currentQuestion.difficulty}</Text>
      </View>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      <TextInput
        style={[styles.answerInput, focused && styles.answerInputFocused]}
        placeholder="Type your answer here..."
        placeholderTextColor={colors.muted}
        multiline
        value={answer}
        onChangeText={setAnswer}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.submitButtonText}>
            {isLastQuestion ? "Submit and finish" : "Submit and continue"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  dotsRow: { flexDirection: "row", marginBottom: spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginRight: spacing.xs,
  },
  dotActive: { backgroundColor: colors.amber, width: 20 },
  dotDone: { backgroundColor: colors.navy },
  progressLabel: { ...type.subtitle, marginBottom: spacing.lg },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    marginRight: spacing.md,
  },
  badgeNavy: { backgroundColor: colors.navySoft },
  badgeAmber: { backgroundColor: colors.amberSoft },
  badgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase" },
  badgeTextNavy: { color: colors.navy },
  badgeTextAmber: { color: colors.amberDeep },
  difficulty: { fontSize: 12, color: colors.muted, fontWeight: "600", textTransform: "capitalize" },
  question: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 27,
    marginBottom: spacing.xl,
  },
  answerInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 15,
    color: colors.ink,
    minHeight: 170,
    textAlignVertical: "top",
    marginBottom: spacing.xl,
  },
  answerInputFocused: { borderColor: colors.amber },
  submitButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
});
