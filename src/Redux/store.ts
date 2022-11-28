import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./searchSlice";
import tasksSlice from "./tasksSlice"
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    tasksSlice,
    userSlice,
    searchSlice,
  },
});

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch