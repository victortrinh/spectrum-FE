import React, { createRef } from "react";
import styled from "styled-components";
import JumbotronImage from "../common/images/jumbotron.png";
import RadioLogo from "../common/images/radio.svg";
import AppContext from "AppContext";
import { white } from "../common/styles/colors";
import { StyledInput } from "../common/components/Form.styles";
import { StyledButton } from "../common/components/Button.styles";
import { Resource } from "common/components/Resource";
import { Filter } from "./Filter";
import { Results } from "./Results";
import { SongsAPI, Song } from "common/api/songs";
import { CheckboxModel } from "./common/models/checkboxModel";
import { Loading } from "common/components/Loading";
import { AudioPlayer } from "./AudioPlayer";
import { GenresAPI } from "common/api/genres";

type State = {
  page: number;
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: number;
  searchTerm: string;
  enteredSearchTerm: string;
  allFilteredTracks: Song[];
  tracks: Song[];
  searched: boolean;
  genres: CheckboxModel[];
};

type Props = {
  tracksDB: Song[];
  areTracksLoading: boolean;
  unselectedGenreIdList: number[];
  unselectedPrimitiveIdList: number[];
};

export class SearchApp extends React.PureComponent<Props, State> {
  private searchInputRef = createRef<HTMLInputElement>();
  private filterComponent = createRef<HTMLDivElement>();
  songsApi: SongsAPI = new SongsAPI();
  genresAPI: GenresAPI = new GenresAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      page: 0,
      isLoading: false,
      moreResultsLoading: false,
      totalResults: 0,
      searchTerm: "",
      enteredSearchTerm: "",
      allFilteredTracks: [],
      tracks: [],
      genres: [],
      searched: false
    };
  }

  async componentDidMount() {
    const genres = await this.genresAPI
      .getGenres()
      .then(data => data.data.genres);

    this.setState({
      genres
    });
  }

  onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      this.onSearch();
    }
  };

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;

    this.setState({
      searchTerm
    });
  };

  onSearch = async () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        const searchTerm = this.state.searchTerm.toLowerCase();

        const genresSelected = this.state.genres
          .filter(
            x =>
              !this.props.unselectedGenreIdList.includes(x.id) && x.is_selected
          )
          .map(x => x.name);

        const filteredResults = this.props.tracksDB.filter(
          x =>
            (x.title.toLowerCase().includes(searchTerm) ||
              x.artist.toLowerCase().includes(searchTerm) ||
              x.album.toLowerCase().includes(searchTerm)) &&
            genresSelected.includes(x.genre)
        );

        this.setState({
          page: 1,
          isLoading: false,
          enteredSearchTerm: this.state.searchTerm,
          totalResults: filteredResults.length,
          allFilteredTracks: filteredResults,
          tracks: filteredResults.slice(0, 15),
          searched: true
        });
      }
    );
  };

  fetchMore = () => {
    this.setState(prevState => ({
      ...prevState,
      page: prevState.page + 1,
      tracks: prevState.allFilteredTracks.slice(0, 15 * (prevState.page + 1))
    }));
  };

  render() {
    const { areTracksLoading } = this.props;

    if (areTracksLoading) {
      return <Loading />;
    }

    return (
      <StyledSearchApp>
        <div className="jumbotron jumbotron-fluid">
          <div className="mainTitle">
            <div className="logo">SPECTRUM</div>
            <div className="semi-logo">
              <Resource resourceKey="dataset" />
            </div>
          </div>
          <div className="searchContainer container">
            <div className="input-group">
              <AppContext.Consumer>
                {context => (
                  <StyledSearchInput
                    ref={this.searchInputRef}
                    placeholder={context.getResource("tryBeatIt")}
                    className="form-control"
                    onKeyPress={this.onKeyPress}
                    onChange={this.onChange}
                  />
                )}
              </AppContext.Consumer>
              <StyledButton
                className="input-group-addon"
                variant="primary"
                onClick={this.onSearch}
              >
                <Resource resourceKey="search" />
              </StyledButton>
            </div>
          </div>
        </div>
        <div className="results container">
          <div className="row">
            <div className="col-md-12 col-lg-3" ref={this.filterComponent}>
              <Filter />
            </div>
            <div className="col-md-12 col-lg-9">
              <Results
                fetchMore={this.fetchMore}
                {...this.state}
                {...this.props}
              />
            </div>
          </div>
        </div>
        <AppContext.Consumer>
          {context => <AudioPlayer track={context.playedTrack} />}
        </AppContext.Consumer>
      </StyledSearchApp>
    );
  }
}

const StyledSearchApp = styled.div`
  .mainTitle {
    margin-top: -30px;
  }

  .jumbotron {
    position: relative;
    border-radius: 0;
    background-image: url(${JumbotronImage});
    background-size: cover;
    background-repeat: no-repeat;
    text-align: center;

    .logo {
      font-size: 20px;
      color: ${white};
      font-weight: 600;
    }

    .semi-logo {
      color: ${white};
      font-size: 28px;
      font-weight: 900;
    }

    .searchContainer {
      padding: 20px 20px;
      box-shadow: -1px 3px 6px #ccc;
      background-color: ${white};
      position: absolute;
      bottom: -40px;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;

      input {
        background-image: url(${RadioLogo});
        background-repeat: no-repeat;
        background-position: 1% 40%;

        @media only screen and (max-width: 767px) {
          background-position: 3% 40%;
        }
      }
    }

    @media only screen and (max-width: 600px) {
      .logo {
        margin-top: 20px;
        font-size: 18px;
      }

      .semi-logo {
        font-size: 20px;
      }

      .searchContainer {
        bottom: -70px;
      }
    }
  }

  .results {
    margin-top: 80px;

    .row {
      margin: 0;
    }
  }
`;

const StyledSearchInput = styled(StyledInput)`
  background-image: url(${RadioLogo});
  background-repeat: no-repeat;
  background-position: 1% 40%;
  height: 40px !important;
  margin-right: 15px !important;
  border-radius: 3px !important;
  padding-left: 40px !important;
`;
