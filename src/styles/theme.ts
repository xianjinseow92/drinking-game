import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const colorSchemeTwo = {
  primary: "#df0079",
  secondary: "#ff5c01",
  tertiary: "#ff9a00",
  backup: "#c632ac",
};

const rootBodyStyles = {
  html: {
    height: "100%",
  },
  body: {
    height: "100%",
    "& #root": {
      height: "100%",
    },
  },
};

let theme = createTheme({
  palette: {
    primary: {
      main: colorSchemeTwo.primary,
    },
    secondary: {
      main: colorSchemeTwo.secondary,
    },
    background: {
      default: colorSchemeTwo.primary,
    },
  },
  typography: {
      fontFamily: "'Preahvihear', sans-serif;"
  },
  // Component overrides
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...rootBodyStyles,
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: "center",
          marginBottom: "20px"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiDrawer-paper": {
            backgroundColor: "rgba(255, 255, 255, 0.3)"
          }
        }
      }
    }
  },
});

theme = responsiveFontSizes(theme); // add responsive typography

export default theme;
