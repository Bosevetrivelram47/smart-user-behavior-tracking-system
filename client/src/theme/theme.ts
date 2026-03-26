import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { createContext, useContext } from "react";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

const baseTypography: ThemeOptions["typography"] = {
  fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { fontWeight: 600, textTransform: "none" },
};

const baseComponents: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: "8px 20px",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 10,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 600, fontSize: "0.75rem" },
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        border: "none",
        borderRadius: 16,
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#06b6d4",
      light: "#67e8f9",
      dark: "#0e7490",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    success: { main: "#10b981" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
    info: { main: "#3b82f6" },
  },
  typography: baseTypography,
  components: baseComponents,
  shape: { borderRadius: 10 },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      light: "#a5b4fc",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#22d3ee",
      light: "#67e8f9",
      dark: "#0891b2",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    success: { main: "#10b981" },
    warning: { main: "#f59e0b" },
    error: { main: "#f87171" },
    info: { main: "#60a5fa" },
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "none",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
  shape: { borderRadius: 10 },
});
