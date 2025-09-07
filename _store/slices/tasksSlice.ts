import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Task = { id: string; title: string };
type TaskState = { tasks: Task[] };

const initialState: TaskState = { tasks: [] };

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;   // ✅ must be default
