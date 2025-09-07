import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Profile() {
  const userName = "Kavishka";
  const userEmail = "kavishka@example.com";

  return (
    <View style={styles.container}>
      {/* User Icon */}
      <Icon name="account-circle" size={80} color="#007AFF" style={styles.icon} />

      {/* User Info */}
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.email}>{userEmail}</Text>
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
