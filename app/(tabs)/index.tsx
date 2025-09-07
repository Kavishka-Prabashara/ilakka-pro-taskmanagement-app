import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const backgroundImage = require("@/app/assets/images/background-image.png");

export default function TaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<
    { id: number; title: string; description: string; date: Date; completed: boolean }[]
  >([]);

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleAddTask = () => {
    if (title.trim().length > 0) {
      setTasks([
        ...tasks,
        { id: Date.now(), title, description, date, completed: false },
      ]);
      setTitle("");
      setDescription("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        {/* Title */}
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Task Description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Date Picker */}
        <Button title="Pick Date" onPress={() => setShowDate(true)} />
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

        {/* Time Picker */}
        <Button title="Pick Time" onPress={() => setShowTime(true)} />
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

        {/* Add Task */}
        <Button title="Add Task" onPress={handleAddTask} />

        {/* Task List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text style={[styles.task, item.completed && styles.completed]}>
                {item.title} - {item.description}{"\n"}
                {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}
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
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  list: {
    marginTop: 20,
  },
  task: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginVertical: 5,
    borderRadius: 6,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
