import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SearchType = {
  input: string;
};

const initialState: SearchType = {
  input: "",
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    clearInput(state) {
      state.input = "";
    },
  },
});

export const { setInput, clearInput } = searchSlice.actions;
export default searchSlice.reducer