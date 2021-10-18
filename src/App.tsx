import { Suspense } from "react";

// Styles
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "styles/theme";
import CssBaseline from "@mui/material/CssBaseline";

// Route-related
import { Switch, Route, useLocation } from "react-router-dom";
import routes from "routes";

// Utilities
import map from "lodash/map";

// Helpers
import { isNotMainRoute } from "helpers/helpers";

// Components
import ClockLoader from "react-spinners/ClockLoader";
import GoBackToMainPage from "components/go-back-to-main-page/GoBackToMainpage";

const renderRoute = (route: any) => {
  return (
    <Route key={route.name} path={route.name} component={route.component} />
  );
};

function App() {
  const location = useLocation();

  return (
    // <div className="App">
    //   <header className="App-header">

    //   </header>
    // </div>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="App-header">
          <Suspense fallback={<ClockLoader />}>
            <Switch location={location} key={location.pathname}>
              {/* <GameSelectPage /> */}
              {map(routes, renderRoute)}
            </Switch>
          </Suspense>
          {isNotMainRoute(location.pathname) && <GoBackToMainPage />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
