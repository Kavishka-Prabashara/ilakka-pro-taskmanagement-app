import React, { useState, useEffect, useContext } from "react";
import api from "../lib/api";
import { AuthContext } from "../contexts/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const backgroundImage = require("../assets/images/background-image.png");

export default function TaskScreen() {
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<
    { id: number; title: string; description: string; date: string; completed: boolean }[]
  >([]);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (title.trim().length > 0) {
      try {
        const res = await api.post(
          "/tasks",
          { title, description, date: date.toISOString() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
        setTitle("");
        setDescription("");
      } catch (err) {
        console.error("Error adding task:", err);
      }
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const res = await api.patch(
        `/tasks/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Task Description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setShowDate(true)} style={styles.iconButton}>
            <Icon name="calendar-today" size={28} color="#007AFF" />
            <Text style={styles.iconLabel}>Pick Date</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowTime(true)} style={styles.iconButton}>
            <Icon name="access-time" size={28} color="#007AFF" />
            <Text style={styles.iconLabel}>Pick Time</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeInline}>
          <Icon name="calendar-today" size={18} color="#007AFF" style={styles.inlineIcon} />
          <Text style={styles.inlineText}>
            <Text style={styles.bold}>Date:</Text> {date.toLocaleDateString()}
          </Text>

          <Icon name="access-time" size={18} color="#007AFF" style={styles.inlineIcon} />
          <Text style={styles.inlineText}>
            <Text style={styles.bold}>Time:</Text> {date.toLocaleTimeString()}
          </Text>
        </View>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDate(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {showTime && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowTime(false);
              if (selectedTime) setDate(selectedTime);
            }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text style={[styles.task, item.completed && styles.completed]}>
                {item.title} - {item.description}{"\n"}
                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, padding: 20, justifyContent: "flex-start" },
  input: { backgroundColor: "rgba(255,255,255,0.9)", padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16, color: "#000" },
  textArea: { height: 80, textAlignVertical: "top" },
  iconRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  iconButton: { alignItems: "center" },
  iconLabel: { fontSize: 12, color: "#007AFF", marginTop: 4 },
  dateTimeInline: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginVertical: 10, paddingHorizontal: 10 },
  inlineIcon: { marginHorizontal: 6 },
  inlineText: { fontSize: 15, color: "#333", marginRight: 12 },
  bold: { fontWeight: "bold", color: "#000" },
  addButton: { backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  list: { marginTop: 20 },
  task: { fontSize: 16, padding: 10, backgroundColor: "rgba(255,255,255,0.8)", marginVertical: 5, borderRadius: 6 },
  completed: { textDecorationLine: "line-through", color: "gray" },
});
