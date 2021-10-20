import { Suspense } from "react";

// Styles
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "styles/theme";
import CssBaseline from "@mui/material/CssBaseline";

// Route-related
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import routes from "routes";
import { mainPage } from "routes";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="App-header">
          <Suspense fallback={<ClockLoader />}>
            <Switch location={location} key={location.pathname}>
              <Redirect from="/" to={mainPage} />
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
