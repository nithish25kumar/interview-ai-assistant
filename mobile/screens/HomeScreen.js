import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSessions } from "../utils/storage";
import { colors, spacing, radius, type } from "../theme";

function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function overallScore(session) {
  const all = session.results.flatMap((r) => [
    r.feedback.clarity_score,
    r.feedback.structure_score,
    r.feedback.completeness_score,
  ]);
  return average(all);
}

export default function HomeScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getSessions().then((s) => {
        if (active) setSessions(s);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const totalSessions = sessions.length;
  const avgScore = average(sessions.map(overallScore));
  const recent = sessions.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={type.eyebrow}>Interview prep</Text>
      <Text style={[type.title, styles.title]}>Ready to practice?</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSessions ? avgScore.toFixed(1) : "—"}</Text>
          <Text style={styles.statLabel}>Avg score</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("PracticeSetup")}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>Start new practice</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={type.label}>Recent sessions</Text>
        {totalSessions > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate("History")}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {recent.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No sessions yet — start a practice round to see your history here.
          </Text>
        </View>
      ) : (
        recent.map((session, i) => (
          <TouchableOpacity
            key={i}
            style={styles.sessionCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SessionSummary", { results: session.results })}
          >
            <View>
              <Text style={styles.sessionRole}>{session.role}</Text>
              <Text style={styles.sessionDate}>{session.date}</Text>
            </View>
            <Text style={styles.sessionScore}>{overallScore(session).toFixed(1)}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  title: { marginTop: spacing.xs, marginBottom: spacing.xl },
  statsRow: { flexDirection: "row", marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    alignItems: "center",
  },
  statValue: { fontSize: 26, fontWeight: "700", color: colors.navy },
  statLabel: { fontSize: 12, color: colors.inkSoft, marginTop: spacing.xs, fontWeight: "600" },
  startButton: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  startButtonText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  viewAll: { fontSize: 13, fontWeight: "700", color: colors.amberDeep },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  emptyText: { fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  sessionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionRole: { fontSize: 15, fontWeight: "700", color: colors.ink },
  sessionDate: { fontSize: 12, color: colors.muted, marginTop: 2 },
  sessionScore: { fontSize: 18, fontWeight: "700", color: colors.amberDeep },
});
