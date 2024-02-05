import React from "react";
import { HashRouter, BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "../styles/_app.scss";
import { MachineProvider, initialState } from '../context/index'

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";
import Signup from "../pages/signup";

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated } = useUserState();

  return (
    <MachineProvider initialState={initialState}>
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <SignUpRoute path="/signup" component={Signup} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
    </MachineProvider>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }

  function SignUpRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/signup",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
