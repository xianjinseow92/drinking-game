import { Suspense } from "react";

// Styles
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
import LoadingSpinner from "components/spinners/Spinner.component";
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
      <Suspense fallback={<LoadingSpinner />}>
        <Switch key={location.pathname}>
          {/* Redirect to main page on base url */}
          {/* <Route exact path="/">
            <Redirect to={mainPage}/>
          </Route> */}
          {map(routes, renderRoute)}
          <Route path="*">
            <Redirect to={mainPage}/>
          </Route>
        </Switch>
      </Suspense>

      {/* Allows user to go back to Game Select Page when accessing other pages */}
      {isNotMainRoute(location.pathname) &&
      location.pathname !== mainPage + "/" ? (
        <GoBackToMainPage />
      ) : (
        ""
      )}
    </ThemeProvider>
  );
}

export default App;
