import * as React from "react";
import AppContext from "./AppContext";
import { en } from "./common/resources/en";
import { fr } from "./common/resources/fr";
import { GlobalStyle } from "./common/styles/GlobalStyle";
import { LoginApp } from "./login-page/LoginApp";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { SearchApp } from "./search-page/SearchApp";
import { AppNavBar } from "./common/components/AppNavBar";
import { CreateUserApp } from "create-user-page/CreateUserApp";
import { CheckboxModel } from "search-page/common/models/checkboxModel";
import { AdminApp } from "admin-page/AdminPage";
import { NeedPermissionApp } from "need-permission-page/NeedPermissionApp";
import { GenresAPI } from "common/api/genres";
import { PrimitivesAPI } from "common/api/primitives";

type State = {
  loggedIn: boolean;
  language: string;
  genres: CheckboxModel[];
  primitives: CheckboxModel[];
  setLanguage: (language: string) => void;
  getResource: (resourceKey: string) => string;
};

export default class App extends React.Component<{}, State> {
  genresAPI: GenresAPI = new GenresAPI();
  primitivesAPI: PrimitivesAPI = new PrimitivesAPI();

  constructor(props: any) {
    super(props);

    let language = localStorage.getItem("language");
    const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (language === null) {
      language = window.navigator.language;
      localStorage.setItem("language", language);
    }

    this.state = {
      language,
      genres: [],
      primitives: [],
      loggedIn,
      setLanguage: this.setLanguage,
      getResource: this.getResource
    };
  }

  async componentDidMount() {
    const genres = await this.genresAPI
      .getGenres()
      .then(data => data.data.genres);

    const primitives = await this.primitivesAPI
      .getPrimitives()
      .then(data => data.data.primitives);

    this.setState({
      genres,
      primitives
    });
  }

  setLanguage = (language: string) => {
    this.setState(
      {
        language
      },
      () => {
        localStorage.setItem("language", language);
      }
    );
  };

  setLogIn = (loggedIn: boolean) => {
    this.setState({
      loggedIn
    });
  };

  getResource = (resourceKey: string): string => {
    const resource = this.state.language.includes("fr")
      ? fr[resourceKey]
      : en[resourceKey];

    return resource === undefined
      ? "## MISSING RESOURCE: " + resourceKey
      : resource;
  };

  public render() {
    const { language, loggedIn } = this.state;

    return (
      <AppContext.Provider value={this.state}>
        <Router>
          <AppNavBar
            loggedIn={loggedIn}
            setLogIn={this.setLogIn}
            language={language}
            setLanguage={this.setLanguage}
          />
          <Route exact path="/" component={SearchApp} />
          <Route
            path="/login"
            render={() => (
              <LoginApp loggedIn={loggedIn} setLogIn={this.setLogIn} />
            )}
          />
          <Route path="/needPermission" component={NeedPermissionApp} />
          <PrivateRoute path="/admin" component={AdminApp} />
          <Route path="/createUser" component={CreateUserApp} />
        </Router>
        <GlobalStyle />
      </AppContext.Provider>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("loggedIn") === "true" ? (
        <Component {...props} />
      ) : (
        <Redirect to="/needPermission" />
      )
    }
  />
);
