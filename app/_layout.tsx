// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Separate component that lives INSIDE AuthProvider
function RootNavigator() {
  const { token } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        // ✅ Logged in → show tabs
        <Stack.Screen name="(tabs)" />
      ) : (
        // ❌ Not logged in → show auth
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
