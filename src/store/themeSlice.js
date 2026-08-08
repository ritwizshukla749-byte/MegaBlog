import { createSlice } from "@reduxjs/toolkit";

export const THEME_KEY = "megablog-theme";

function getInitialMode() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // storage unavailable — fall through to system preference
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

const initialState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload === "dark" ? "dark" : "light";
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
