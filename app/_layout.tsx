import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function RootStack() {
  const { token } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        // ✅ If logged in -> go to tabs
        <Stack.Screen name="(tabs)" />
      ) : (
        // ❌ If not logged in -> show auth flow
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
