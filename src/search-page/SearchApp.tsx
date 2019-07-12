import React, { createRef } from "react";
import styled from "styled-components";
import JumbotronImage from "../common/images/jumbotron.png";
import RadioLogo from "../common/images/radio.svg";
import AppContext from "AppContext";
import MissingImage from "../common/images/missingSong.png";
import { white } from "../common/styles/colors";
import { StyledInput } from "../common/components/Form.styles";
import { StyledButton } from "../common/components/Button.styles";
import { Resource } from "common/components/Resource";
import { Filter } from "./Filter";
import { Results } from "./Results";
import { SongsAPI, Song } from "common/api/songs";
import { CheckboxModel } from "./common/models/checkboxModel";
import { Loading } from "common/components/Loading";

type State = {
  page: number;
  isFirstTimeLoading: boolean;
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: number;
  searchTerm: string;
  enteredSearchTerm: string;
  allFilteredTracks: Song[];
  tracks: Song[];
  tracksDB: Song[];
  searched: boolean;
};

export class SearchApp extends React.PureComponent<{}, State> {
  private searchInputRef = createRef<HTMLInputElement>();
  private filterComponent = createRef<HTMLDivElement>();
  songsApi: SongsAPI = new SongsAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      page: 0,
      isFirstTimeLoading: true,
      isLoading: false,
      moreResultsLoading: false,
      totalResults: 0,
      searchTerm: "",
      enteredSearchTerm: "",
      allFilteredTracks: [],
      tracks: [],
      tracksDB: [],
      searched: false
    };
  }

  async componentDidMount() {
    // TODO: Insert image, album
    const tracksDB = await this.songsApi.getSongs().then(data =>
      data.data.songs.map(
        (song: Song) =>
          ({
            ...song,
            image_src: "https://i.scdn.co/image/966ade7a8c43b72faa53822b74a899c675aaafee",
            duration: this.millisToMinutesAndSeconds(
              Number(song.primitives[0][1])
            ),
            album: "TODO ADD ALBUM",
            preview_url:
              "https://p.scdn.co/mp3-preview/229bb6a4c7011158cc7e1aff11957e274dc05e84?cid=774b29d4f13844c495f206cafdad9c86"
          } as Song)
      )
    );

    this.setState({
      tracksDB,
      isFirstTimeLoading: false
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

  millisToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  };

  onSearch = async () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        const searchTerm = this.state.searchTerm.toLowerCase();

        let allGenres: CheckboxModel[] = [];
        let genresSelected: string[] = [];

        if (this.filterComponent.current) {
          const allGenreInputs = this.filterComponent.current
            .querySelectorAll("#genresFilter")[0]
            .querySelectorAll<HTMLInputElement>("input[type='checkbox']");

          allGenreInputs.forEach((x: any) =>
            allGenres.push({
              is_selected: x.checked,
              name: x.labels[0].innerHTML
            } as CheckboxModel)
          );
        }

        genresSelected = allGenres.filter(x => x.is_selected).map(x => x.name);

        const filteredResults = this.state.tracksDB.filter(
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
    const { isFirstTimeLoading } = this.state;

    if (isFirstTimeLoading) {
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
              <Results fetchMore={this.fetchMore} {...this.state} />
            </div>
          </div>
        </div>
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
