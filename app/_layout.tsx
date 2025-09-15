import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { MatchesProvider } from "../contexts/MatchesContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";

export default function Layout() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <MatchesProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </MatchesProvider>
      </AuthProvider>
    </OnboardingProvider>
  );
}
