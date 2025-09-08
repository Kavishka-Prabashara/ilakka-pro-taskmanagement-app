// (tabs)/index.tsx

import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
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
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const backgroundImage = require("../assets/images/background-image.png");

type Task = {
  id: number;
  title: string;
  description?: string | null;
  date?: string | null;
  completed: boolean;
};

export default function TaskScreen() {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // --- Edit Modal States ---
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState(new Date());
  const [showEditDate, setShowEditDate] = useState(false);
  const [showEditTime, setShowEditTime] = useState(false);

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
    if (title.trim().length === 0) return;
    try {
      const res = await api.post(
        "/tasks",
        { title, description, date: date.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const res = await api.patch(
        `/tasks/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask(id) },
    ]);
  };

  // --- Open + Save Edit ---
  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description ?? "");
    setEditDate(task.date ? new Date(task.date) : new Date());
  };

  const saveEdit = async () => {
    if (!editTask) return;
    try {
      const res = await api.put(
        `/tasks/${editTask.id}`,
        { title: editTitle, description: editDesc, date: editDate.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t.id === editTask.id ? res.data : t)));
      setEditTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    const hasDate = !!item.date;
    const dateStr = hasDate ? new Date(item.date as string).toLocaleDateString() : "No date";
    const timeStr = hasDate ? new Date(item.date as string).toLocaleTimeString() : "";

    return (
      <View style={styles.taskRow}>
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => toggleTask(item.id)}
          onLongPress={() => openEdit(item)}
        >
          <Text style={[styles.taskTitle, item.completed && styles.completed]} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={[styles.taskDesc, item.completed && styles.completed]}>
              {item.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Icon name="calendar-today" size={16} />
            <Text style={styles.metaText}>{dateStr}</Text>
            {hasDate ? (
              <>
                <Icon name="access-time" size={16} style={{ marginLeft: 8 }} />
                <Text style={styles.metaText}>{timeStr}</Text>
              </>
            ) : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
          <Icon name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
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

        {/* Pick Date + Time */}
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

        {/* DateTimePicker for add */}
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
              if (selectedTime) {
                const merged = new Date(date);
                merged.setHours(selectedTime.getHours());
                merged.setMinutes(selectedTime.getMinutes());
                merged.setSeconds(0);
                merged.setMilliseconds(0);
                setDate(merged);
              }
            }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 24 }}
        />

        {/* --- Edit Modal --- */}
        <Modal visible={!!editTask} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} placeholder="Title" />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editDesc}
                onChangeText={setEditDesc}
                placeholder="Description"
                multiline
              />

              {/* Edit Date + Time pickers */}
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => setShowEditDate(true)} style={styles.iconButton}>
                  <Icon name="calendar-today" size={28} color="#007AFF" />
                  <Text style={styles.iconLabel}>Pick Date</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEditTime(true)} style={styles.iconButton}>
                  <Icon name="access-time" size={28} color="#007AFF" />
                  <Text style={styles.iconLabel}>Pick Time</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateTimeInline}>
                <Icon name="calendar-today" size={18} color="#007AFF" style={styles.inlineIcon} />
                <Text style={styles.inlineText}>
                  <Text style={styles.bold}>Date:</Text> {editDate.toLocaleDateString()}
                </Text>
                <Icon name="access-time" size={18} color="#007AFF" style={styles.inlineIcon} />
                <Text style={styles.inlineText}>
                  <Text style={styles.bold}>Time:</Text> {editDate.toLocaleTimeString()}
                </Text>
              </View>

              {showEditDate && (
                <DateTimePicker
                  value={editDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowEditDate(false);
                    if (selectedDate) setEditDate(selectedDate);
                  }}
                />
              )}
              {showEditTime && (
                <DateTimePicker
                  value={editDate}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedTime) => {
                    setShowEditTime(false);
                    if (selectedTime) {
                      const merged = new Date(editDate);
                      merged.setHours(selectedTime.getHours());
                      merged.setMinutes(selectedTime.getMinutes());
                      merged.setSeconds(0);
                      merged.setMilliseconds(0);
                      setEditDate(merged);
                    }
                  }}
                />
              )}

              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditTask(null)}>
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, padding: 20 },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  iconRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  iconButton: { alignItems: "center" },
  iconLabel: { fontSize: 12, color: "#007AFF", marginTop: 4 },
  dateTimeInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inlineIcon: { marginHorizontal: 6 },
  inlineText: { fontSize: 15, color: "#333", marginRight: 12 },
  bold: { fontWeight: "bold", color: "#000" },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  list: { marginTop: 20 },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginVertical: 5,
    borderRadius: 8,
  },
  taskContent: { flex: 1, paddingRight: 8 },
  taskTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  taskDesc: { fontSize: 14, color: "#333", marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { fontSize: 12, color: "#444", marginLeft: 4 },
  deleteButton: { padding: 8, borderRadius: 8 },
  completed: { textDecorationLine: "line-through", color: "gray" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  saveButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
  cancelButton: { backgroundColor: "#aaa", padding: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
});
