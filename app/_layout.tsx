import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <- fixed path

function RootStack() {
  const { token } = useAuth();

  return (
    <Stack>
      {!token ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
