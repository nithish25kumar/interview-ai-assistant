import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { saveSession } from "../utils/storage";
import { colors, spacing, radius, type } from "../theme";

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function ScoreMeter({ label, value }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  return (
    <View style={styles.meterBlock}>
      <View style={styles.meterHeader}>
        <Text style={styles.meterLabel}>{label}</Text>
        <Text style={styles.meterValue}>{value.toFixed(1)}</Text>
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export default function SessionSummaryScreen({ route, navigation }) {
  const { results, role } = route.params;
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveSession({
      role: role || "Practice session",
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      results,
    });
  }, []);

  const clarityAvg = average(results.map((r) => r.feedback.clarity_score));
  const structureAvg = average(results.map((r) => r.feedback.structure_score));
  const completenessAvg = average(results.map((r) => r.feedback.completeness_score));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={type.eyebrow}>Session complete</Text>
      <Text style={[type.title, styles.title]}>Here's how you did</Text>

      <View style={styles.metersCard}>
        <ScoreMeter label="Clarity" value={clarityAvg} />
        <ScoreMeter label="Structure" value={structureAvg} />
        <ScoreMeter label="Completeness" value={completenessAvg} />
      </View>

      <Text style={[type.label, styles.breakdownLabel]}>Question breakdown</Text>

      {results.map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardQuestion}>{`Q${i + 1}. ${r.question}`}</Text>

          <Text style={styles.cardSectionLabel}>Your answer</Text>
          <Text style={styles.cardAnswer}>{r.answer}</Text>

          <Text style={styles.cardSectionLabel}>Suggestions</Text>
          {r.feedback.suggestions.map((s, j) => (
            <View key={j} style={styles.suggestionRow}>
              <View style={styles.suggestionDot} />
              <Text style={styles.suggestionText}>{s}</Text>
            </View>
          ))}

          <Text style={styles.cardSectionLabel}>Stronger phrasing</Text>
          <Text style={styles.example}>{r.feedback.stronger_phrasing_example}</Text>

          {r.feedback.used_star_method !== null && (
            <View
              style={[
                styles.starBadge,
                r.feedback.used_star_method ? styles.starBadgeYes : styles.starBadgeNo,
              ]}
            >
              <Text
                style={[
                  styles.starBadgeText,
                  r.feedback.used_star_method ? styles.starBadgeTextYes : styles.starBadgeTextNo,
                ]}
              >
                STAR method {r.feedback.used_star_method ? "used" : "not used"}
              </Text>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate("Home")}
        activeOpacity={0.85}
      >
        <Text style={styles.doneButtonText}>Back to home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  title: { marginTop: spacing.xs, marginBottom: spacing.xl },

  metersCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  meterBlock: { marginBottom: spacing.lg },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  meterLabel: { fontSize: 13, fontWeight: "600", color: colors.inkSoft },
  meterValue: { fontSize: 13, fontWeight: "700", color: colors.ink },
  meterTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.navySoft,
    overflow: "hidden",
  },
  meterFill: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.amber,
  },

  breakdownLabel: { marginBottom: spacing.md },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardQuestion: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: 21,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: colors.muted,
    textTransform: "uppercase",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  cardAnswer: { fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  suggestionRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.xs },
  suggestionDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.amber,
    marginTop: 7,
    marginRight: spacing.sm,
  },
  suggestionText: { fontSize: 14, color: colors.ink, lineHeight: 20, flex: 1 },
  example: { fontSize: 14, color: colors.ink, fontStyle: "italic", lineHeight: 20 },

  starBadge: {
    alignSelf: "flex-start",
    marginTop: spacing.md,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  starBadgeYes: { backgroundColor: colors.successSoft },
  starBadgeNo: { backgroundColor: colors.dangerSoft },
  starBadgeText: { fontSize: 11, fontWeight: "700" },
  starBadgeTextYes: { color: colors.success },
  starBadgeTextNo: { color: colors.danger },

  doneButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  doneButtonText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
});
