import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;