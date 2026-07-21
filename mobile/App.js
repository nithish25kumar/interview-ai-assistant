import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import PracticeSetupScreen from "./screens/PracticeSetupScreen";
import InterviewSessionScreen from "./screens/InterviewSessionScreen";
import SessionSummaryScreen from "./screens/SessionSummaryScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { colors } from "./theme";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.paper },
  headerShadowVisible: false,
  headerTintColor: colors.ink,
  headerTitleStyle: { fontWeight: "700" },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Interview Prep" }} />
        <Stack.Screen
          name="PracticeSetup"
          component={PracticeSetupScreen}
          options={{ title: "Set Up Practice" }}
        />
        <Stack.Screen
          name="InterviewSession"
          component={InterviewSessionScreen}
          options={{ title: "Practice Session" }}
        />
        <Stack.Screen
          name="SessionSummary"
          component={SessionSummaryScreen}
          options={{ title: "Summary", headerBackVisible: false }}
        />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: "History" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
