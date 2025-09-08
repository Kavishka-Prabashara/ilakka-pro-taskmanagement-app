import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../contexts/AuthContext"; // ✅ import your auth context

export default function Profile() {
  const { user } = useAuth(); // ✅ get user object from context

  return (
    <View style={styles.container}>
      {/* User Icon */}
      <Icon name="account-circle" size={80} color="#007AFF" style={styles.icon} />

      {/* User Info */}
      <Text style={styles.email}>{user?.email || "No email available"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  icon: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
});
