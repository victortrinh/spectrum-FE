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
import {
  CheckboxModel,
  PrimitiveCheckboxModel
} from "search-page/common/models/checkboxModel";
import { AdminApp } from "admin-page/AdminPage";
import { NeedPermissionApp } from "need-permission-page/NeedPermissionApp";
import { GenresAPI } from "common/api/genres";
import { PrimitivesAPI } from "common/api/primitives";
import { TrackApp } from "track-page/TrackApp";
import { SongsAPI, Song } from "common/api/songs";
import { millisToMinutesAndSeconds } from "common/api/utilities";

type State = {
  loggedIn: boolean;
  language: string;
  playedTrack: Song | null;
  genres: CheckboxModel[];
  primitives: PrimitiveCheckboxModel[];
  tracksDB: Song[];
  areTracksLoading: boolean;
  unselectedPrimitiveIdList: number[];
  unselectedGenreIdList: number[];
  updateUnselectedGenreIdList: (id: number, checked: boolean) => void;
  userUncheckAllPrimitives: () => void;
  userCheckAllPrimitives: () => void;
  userUncheckAllGenres: () => void;
  userCheckAllGenres: () => void;
  updateUnselectedPrimitiveIdList: (id: number, checked: boolean) => void;
  setPlayedTrack: (
    playedTrack: Song
  ) => (e: React.SyntheticEvent<HTMLDivElement>) => void;
  setLanguage: (language: string) => void;
  getResource: (resourceKey: string) => string;
};

export default class App extends React.Component<{}, State> {
  genresAPI: GenresAPI = new GenresAPI();
  primitivesAPI: PrimitivesAPI = new PrimitivesAPI();
  songsApi: SongsAPI = new SongsAPI();

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
      playedTrack: null,
      genres: [],
      primitives: [],
      tracksDB: [],
      loggedIn,
      unselectedPrimitiveIdList: [],
      unselectedGenreIdList: [],
      userUncheckAllPrimitives: this.userUncheckAllPrimitives,
      userCheckAllPrimitives: this.userCheckAllPrimitives,
      userUncheckAllGenres: this.userUncheckAllGenres,
      userCheckAllGenres: this.userCheckAllGenres,
      updateUnselectedGenreIdList: this.updateUnselectedGenreIdList,
      updateUnselectedPrimitiveIdList: this.updateUnselectedPrimitiveIdList,
      areTracksLoading: true,
      setPlayedTrack: this.setPlayedTrack,
      setLanguage: this.setLanguage,
      getResource: this.getResource
    };
  }

  async componentDidMount() {
    let tracksDB = JSON.parse(sessionStorage.getItem(
      "tracksDB"
    ) as string) as any;

    const genres = await this.genresAPI
      .getGenres()
      .then(data => data.data.genres);

    if (genres) {
      genres.sort((a: CheckboxModel, b: CheckboxModel) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }

    const primitives = await this.primitivesAPI
      .getPrimitives()
      .then(data => data.data.primitives);

    if (primitives) {
      primitives.sort(
        (a: PrimitiveCheckboxModel, b: PrimitiveCheckboxModel) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }
      );
    }

    if (!tracksDB) {
      tracksDB = await this.songsApi.getSongs().then(data => {
        debugger;
        return data.data.songs.map(
          (song: Song) =>
            ({
              ...song,
              duration: millisToMinutesAndSeconds(Number(song.primitives[0][1]))
            } as Song)
        );
      });

      sessionStorage.setItem("tracksDB", JSON.stringify(tracksDB));
    }

    this.setState({
      genres,
      primitives,
      tracksDB,
      areTracksLoading: false
    });
  }

  userUncheckAllPrimitives = () => {
    this.setState(prevState => ({
      ...prevState,
      unselectedPrimitiveIdList: prevState.primitives
        .filter(x => x.is_selected)
        .map(x => x.id)
    }));
  };

  userCheckAllPrimitives = () => {
    this.setState({
      unselectedPrimitiveIdList: []
    });
  };

  userUncheckAllGenres = () => {
    this.setState(prevState => ({
      ...prevState,
      unselectedGenreIdList: prevState.genres
        .filter(x => x.is_selected)
        .map(x => x.id)
    }));
  };

  userCheckAllGenres = () => {
    this.setState({
      unselectedGenreIdList: []
    });
  };

  updateUnselectedGenreIdList = (id: number, checked: boolean) => {
    if (!checked) {
      this.setState(prevState => ({
        ...prevState,
        unselectedGenreIdList: prevState.unselectedGenreIdList.concat(id)
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        unselectedGenreIdList: prevState.unselectedGenreIdList.filter(
          x => x !== id
        )
      }));
    }
  };

  updateUnselectedPrimitiveIdList = (id: number, checked: boolean) => {
    if (!checked) {
      this.setState(prevState => ({
        ...prevState,
        unselectedPrimitiveIdList: prevState.unselectedPrimitiveIdList.concat(
          id
        )
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        unselectedPrimitiveIdList: prevState.unselectedPrimitiveIdList.filter(
          x => x !== id
        )
      }));
    }
  };

  setPlayedTrack = (playedTrack: Song) => (
    e: React.SyntheticEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    this.setState({
      playedTrack
    });
  };

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
          <Route exact path="/" render={() => <SearchApp {...this.state} />} />
          <Route
            path="/login"
            render={() => (
              <LoginApp loggedIn={loggedIn} setLogIn={this.setLogIn} />
            )}
          />
          <Route path="/needPermission" component={NeedPermissionApp} />
          <Route path="/track/:id" component={TrackApp} />
          <PrivateRoute path="/admin" component={AdminApp} />
          <PrivateRoute path="/createUser" component={CreateUserApp} />
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
