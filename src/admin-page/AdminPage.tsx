import React from "react";
import styled from "styled-components";
import randomColor from "randomcolor";
import PieChart from "react-minimal-pie-chart";
import { lightGray, white, primaryColor, darkGray } from "common/styles/colors";
import { Resource } from "common/components/Resource";
import { StyledButton } from "common/components/Button.styles";
import { Redirect } from "react-router";
import { Genres, GenreModel } from "./models/genreModel";
import { Circle } from "common/images/Circle";
import { StyledInput } from "common/components/Form.styles";
import AppContext from "AppContext";
import { FilterSelection } from "search-page/common/components/FilterSelection";
import { CheckboxSelection } from "search-page/common/components/CheckboxSelection";

type State = {
  createUser: boolean;
  genres: GenreModel[];
  totalDbSpace: number;
  usedDbSpace: number;
  temporaryDbSpace: number;
};

export class AdminApp extends React.PureComponent<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      createUser: false,
      genres: [],
      totalDbSpace: 500,
      usedDbSpace: 324,
      temporaryDbSpace: 500
    };
  }

  componentDidMount = () => {
    // TODO: To get genres from backend
    const colors = randomColor({
      count: Genres().length
    });

    this.setState({
      genres: Genres().map((genre, index) => ({
        name: genre.name,
        percentage: genre.percentage,
        color: colors[index]
      }))
    });
  };

  createUser = () => {
    this.setState({
      createUser: true
    });
  };

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    this.setState({
      [name]: Number(value)
    } as any);
  };

  onChangeCheckboxGenre = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO
  };

  onChangeCheckboxPrimitive = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO
  };

  onBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    this.setState({
      totalDbSpace: Number(value)
    });
  };

  render() {
    const {
      createUser,
      genres,
      totalDbSpace,
      usedDbSpace,
      temporaryDbSpace
    } = this.state;

    if (createUser) {
      return <Redirect to="/createUser" />;
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
          </div>
          <div className="row">
            <div className="col-xs-12 col-lg-7">
              <div className="innerContainer">
                <div className="innerContent">
                  <div className="subHeader">
                    <Resource resourceKey="maximumDbStorage" />
                  </div>
                  <div className="dbStorage">
                    <span className="dbTotal">
                      {usedDbSpace} GB <Resource resourceKey="availableOf" />{" "}
                      {totalDbSpace} GB
                    </span>
                    <span className="float-right">
                      <div>
                        <span style={{ color: darkGray }}>Max:</span>
                        <StyledInput
                          value={temporaryDbSpace}
                          name="temporaryDbSpace"
                          onChange={this.onChange}
                          onBlur={this.onBlur}
                          style={{
                            height: "30px",
                            width: "75px",
                            marginLeft: "8px",
                            marginRight: "8px",
                            marginBottom: "5px"
                          }}
                        />
                        GB
                      </div>
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={
                        {
                          width:
                            Math.trunc((usedDbSpace / totalDbSpace) * 100) + "%"
                        } as any
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="distribution innerContainer">
                <div className="innerContent">
                  <div className="subHeader">
                    <Resource resourceKey="currentDatabaseDistribution" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-lg-6">
                    <PieChart
                      lineWidth={40}
                      data={genres.map(genre => ({
                        title: genre.name + " - " + genre.percentage + "%",
                        value: genre.percentage,
                        color: genre.color
                      }))}
                    />
                  </div>
                  <div className="col-xs-12 col-lg-6 my-auto">
                    <ul>
                      {genres.map(genre => (
                        <li key={genre.name}>
                          <span className="circle">
                            <Circle marginBottom="3px" color={genre.color} />
                          </span>
                          <span className="genreName">{genre.name}</span>
                          <span className="float-right">
                            {genre.percentage}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="genresContainer col-xs-12 col-lg-5">
              <div className="innerContainer">
                <div className="innerContent">
                  <div className="subHeader" style={{ marginBottom: "0" }}>
                    <Resource resourceKey="currentDatabaseDistribution" />
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

    .progress {
      height: 30px;
      background-color: ${lightGray};

      .progress-bar {
        background-color: ${primaryColor};
      }
    }

    .dbStorage {
      margin-bottom: 10px;
      height: 30px;

      span {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
      }

      .dbTotal {
        font-weight: 500;
      }
    }
  }

  .distribution {
    margin-top: 15px;

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
