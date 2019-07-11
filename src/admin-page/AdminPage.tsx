import React from "react";
import styled from "styled-components";
import randomColor from "randomcolor";
import PieChart from "react-minimal-pie-chart";
import AppContext from "AppContext";
import ReactLoading from "react-loading";
import { lightGray, white, black } from "common/styles/colors";
import { Resource } from "common/components/Resource";
import { StyledButton } from "common/components/Button.styles";
import { Redirect } from "react-router";
import { GenreModel } from "./models/genreModel";
import { Circle } from "common/images/Circle";
import { FilterSelection } from "search-page/common/components/FilterSelection";
import { CheckboxSelection } from "search-page/common/components/CheckboxSelection";
import { GenresAPI } from "common/api/genres";
import { PrimitivesAPI } from "common/api/primitives";
import { CheckboxModel } from "search-page/common/models/checkboxModel";

type State = {
  createUser: boolean;
  addSongs: boolean;
  genres: GenreModel[];
  genresLoading: boolean;
};

export class AdminApp extends React.PureComponent<{}, State> {
  genresAPI: GenresAPI = new GenresAPI();
  primitivesAPI: PrimitivesAPI = new PrimitivesAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      createUser: false,
      addSongs: false,
      genres: [],
      genresLoading: true
    };
  }

  async componentDidMount() {
    await this.getGenreStats();
  }

  getGenreStats = async () => {
    let genresStats = await this.genresAPI
      .getStats()
      .then(data => data.data.genres);

    const genresDB = await this.genresAPI
      .getGenres()
      .then(data => data.data.genres);

    let genres = genresStats.map((itm: GenreModel) => ({
      ...genresDB.find((item: CheckboxModel) => item.id === itm.id && item),
      ...itm
    }));

    genres = genres
      .filter((x: any) => x.percentage !== 0 && x.is_selected)
      .sort((a: any, b: any) => {
        if (a.genre < b.genre) {
          return -1;
        }
        if (a.genre > b.genre) {
          return 1;
        }
        return 0;
      });

    const colors = randomColor({
      luminosity: "dark",
      count: genres.length
    });

    this.setState({
      genresLoading: false,
      genres: genres.map((genre: GenreModel, index: number) => ({
        ...genre,
        color: colors[index]
      }))
    });
  }

  createUser = () => {
    this.setState({
      createUser: true
    });
  };

  addSongs = () => {
    this.setState({
      addSongs: true
    });
  };

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    this.setState({
      [name]: Number(value)
    } as any);
  };

  onChangeCheckboxGenre = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    await this.genresAPI.updateGenre({
      id: Number(e.currentTarget.id),
      selected: e.currentTarget.checked
    });

    this.setState(
      {
        genresLoading: true
      },
      () => this.getGenreStats()
    );
  };

  onChangeCheckboxPrimitive = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.primitivesAPI.updatePrimitive({
      id: Number(e.currentTarget.id),
      selected: e.currentTarget.checked
    });
  };

  render() {
    const { createUser, addSongs, genres, genresLoading } = this.state;

    const loadingComponent = (
      <ReactLoading
        className="loading"
        type="spinningBubbles"
        color={black}
        height={100}
        width={100}
      />
    );

    if (createUser) {
      return <Redirect to="/createUser" />;
    }

    if (addSongs) {
      return <Redirect to="/addSongs" />;
    }

    return (
      <StyledAdminApp>
        <div className="container">
          <div className="header">
            <span className="title">
              <Resource resourceKey="adminPage" />
            </span>
            <StyledButton
              className="float-right"
              onClick={this.createUser}
              variant="secondary"
            >
              <Resource resourceKey="createUser" />
            </StyledButton>
            <StyledButton
              className="float-right addSongsButton"
              onClick={this.addSongs}
              variant="secondary"
            >
              <Resource resourceKey="addSongs" />
            </StyledButton>
          </div>
          <div className="row">
            <div className="col-xs-12 col-lg-7">
              <div className="distribution innerContainer">
                <div className="innerContent">
                  <div className="subHeader">
                    <Resource resourceKey="currentDatabaseDistribution" />
                  </div>
                </div>
                {genresLoading ? (
                  loadingComponent
                ) : (
                  <div className="row">
                    <div className="col-xs-12 col-lg-6">
                      <PieChart
                        lineWidth={40}
                        data={genres.map(genre => ({
                          title:
                            genre.genre.toUpperCase() +
                            " - " +
                            genre.percentage +
                            "%",
                          value: genre.percentage,
                          color: genre.color
                        }))}
                      />
                    </div>
                    <div className="col-xs-12 col-lg-6 my-auto">
                      <ul>
                        {genres.map(genre => (
                          <li key={genre.id}>
                            <span className="circle">
                              <Circle marginBottom="3px" color={genre.color} />
                            </span>
                            <span className="genreName">{genre.genre}</span>
                            <span className="float-right">
                              {genre.percentage}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="genresContainer col-xs-12 col-lg-5">
              <div className="innerContainer">
                <div className="innerContent">
                  <div className="subHeader" style={{ marginBottom: "0" }}>
                    <Resource resourceKey="activatedFilters" />
                  </div>
                  <AppContext.Consumer>
                    {context => (
                      <FilterSelection
                        headerResourceKey="genres"
                        showFilterAtStart={true}
                        backgroundHeader={true}
                      >
                        <CheckboxSelection
                          marginLeft={true}
                          checkboxes={context.genres}
                          select={true}
                          onChange={this.onChangeCheckboxGenre}
                          filterable={true}
                          placeholderForFilter={context.getResource(
                            "filterGenres"
                          )}
                        />
                      </FilterSelection>
                    )}
                  </AppContext.Consumer>
                  <AppContext.Consumer>
                    {context => (
                      <FilterSelection
                        headerResourceKey="primitives"
                        showFilterAtStart={true}
                        backgroundHeader={true}
                      >
                        <CheckboxSelection
                          marginLeft={true}
                          checkboxes={context.primitives}
                          select={true}
                          onChange={this.onChangeCheckboxPrimitive}
                          filterable={true}
                          placeholderForFilter={context.getResource(
                            "filterPrimitives"
                          )}
                        />
                      </FilterSelection>
                    )}
                  </AppContext.Consumer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StyledAdminApp>
    );
  }
}

const StyledAdminApp = styled.div`
  min-height: 100vh;
  background-color: ${lightGray};

  .header {
    padding-top: 30px;
  }

  .addSongsButton {
    margin-right: 15px;
  }

  .title {
    font-size: 26px;
    font-weight: 500;
  }

  .innerContainer {
    padding: 30px 15px;
    background-color: ${white};
    border-radius: 3px;
  }

  .innerContent {
    margin-left: 15px;
    margin-right: 15px;
  }

  .distribution {
    .row {
      margin-right: 0;
      margin-left: 0;
    }
  }

  .subHeader {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 18px;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;

    li:not(:last-child) {
      padding-bottom: 8px;
    }

    .circle {
      margin-right: 8px;
    }

    .genreName {
      font-size: 15px;
      text-transform: uppercase;
    }
  }

  .genresContainer {
    padding-left: 0;
  }

  @media only screen and (max-width: 991px) {
    .genresContainer {
      padding-left: 15px;
      margin-top: 15px;
    }
  }
`;
