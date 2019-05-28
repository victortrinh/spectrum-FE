import * as React from "react";
import { GlobalStyle } from "./common/styles/GlobalStyle";
import { LoginApp } from "./login-page/LoginApp";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomeApp } from "./home-page/HomeApp";
import { AppNavBar } from "./common/components/AppNavBar";
import { RegisterApp } from "register-page/RegisterApp";

export const App: React.FunctionComponent = () => (
  <>
    <Router>
      <AppNavBar />
      <Route exact path="/" component={HomeApp} />
      <Route path="/login" component={LoginApp} />
      <Route path="/register" component={RegisterApp} />
    </Router>
    <GlobalStyle />
  </>
);
