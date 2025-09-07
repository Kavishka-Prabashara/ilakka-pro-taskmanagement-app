import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext"; // ✅ only useAuth

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onLogin = async () => {
    if (!email || !password) return Alert.alert("Please enter email and password");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/(tabs)"); // ✅ go to tabs after login
    } catch (err: any) {
      Alert.alert("Login failed", err?.response?.data?.error || err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 12, alignItems: "center" },
  linkText: { color: "#007AFF" },
});
