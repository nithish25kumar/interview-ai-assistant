import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSessions, clearSessions } from "../utils/storage";
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

export default function HistoryScreen({ navigation }) {
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

  function handleClear() {
    Alert.alert("Clear history", "This removes all saved sessions from this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearSessions();
          setSessions([]);
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={type.eyebrow}>All sessions</Text>
      <Text style={[type.title, styles.title]}>Practice history</Text>

      {sessions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nothing here yet — completed sessions will show up in this list.</Text>
        </View>
      ) : (
        <>
          {sessions.map((session, i) => (
            <TouchableOpacity
              key={i}
              style={styles.sessionCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SessionSummary", { results: session.results })}
            >
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionRole}>{session.role}</Text>
                <Text style={styles.sessionMeta}>
                  {session.date} · {session.results.length} question{session.results.length === 1 ? "" : "s"}
                </Text>
              </View>
              <Text style={styles.sessionScore}>{overallScore(session).toFixed(1)}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear history</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { padding: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  title: { marginTop: spacing.xs, marginBottom: spacing.xl },
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
  sessionInfo: { flex: 1, marginRight: spacing.md },
  sessionRole: { fontSize: 15, fontWeight: "700", color: colors.ink },
  sessionMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  sessionScore: { fontSize: 18, fontWeight: "700", color: colors.amberDeep },
  clearButton: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  clearButtonText: { fontSize: 14, fontWeight: "700", color: colors.danger },
});
