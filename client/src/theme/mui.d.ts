import { DataGridProps } from "@mui/x-data-grid";

declare module "@mui/material/styles" {
  interface Components {
    MuiDataGrid?: {
      defaultProps?: DataGridProps;
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
  }
}