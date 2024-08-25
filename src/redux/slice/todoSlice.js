import { createSlice } from "@reduxjs/toolkit";
console.log("TODO SLICE Calling...");

export const todoSlice = createSlice({
  name: "todo",
  initialState: JSON.parse(localStorage.getItem("toDoList")) || [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
      const serializedState = JSON.stringify(state);
      localStorage.setItem("toDoList", serializedState);
    },
    listTodo: (state) => state.todo,
    deleteTodo: (state, action) => {
      console.log("Delete TODO");
      const updatedState = state.filter((elem) => elem != action.payload);
      localStorage.setItem("toDoList", JSON.stringify(updatedState));
      return updatedState;
    },
  },
});

export const { addTodo, listTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
