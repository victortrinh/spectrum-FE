import React, { createRef } from "react";
import styled from "styled-components";
import JumbotronImage from "../common/images/jumbotron.png";
import RadioLogo from "../common/images/radio.svg";
import MissingImage from "../common/images/missingSong.png";
import AppContext from "AppContext";
import { white } from "../common/styles/colors";
import { StyledInput } from "../common/components/Form.styles";
import { StyledButton } from "../common/components/Button.styles";
import { Resource } from "common/components/Resource";
import { Filter } from "./Filter";
import { Results } from "./Results";
import { TrackModel } from "./common/models/trackModel";

type State = {
  page: number;
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: string;
  searchTerm: string;
  enteredSearchTerm: string;
  tracks: TrackModel[];
};

export class SearchApp extends React.PureComponent<{}, State> {
  private searchInputRef = createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      page: 1,
      isLoading: false,
      moreResultsLoading: false,
      totalResults: "0",
      searchTerm: "",
      enteredSearchTerm: "",
      tracks: []
    };
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
    const searchTerm = this.state.searchTerm;

    if (searchTerm !== "" || /\S/.test(searchTerm)) {
      this.setState({
        isLoading: true
      });

      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=album.search&album=` +
          searchTerm +
          `&api_key=a09702ee21fe630efc366adf3c546342&format=json&limit=20`
      );

      const results = await response.json();

      this.setState({
        isLoading: false
      });

      let index = 0;

      this.setState({
        enteredSearchTerm: searchTerm,
        totalResults: results.results["opensearch:totalResults"],
        tracks: results.results.albummatches.album.map((album: any) => ({
          id: index++,
          title: "Song name" + index,
          length: "2:58",
          genre: "hip-hop",
          albumName: album.name,
          artist: album.artist,
          imageSrc:
            album.image[2]["#text"] === ""
              ? MissingImage
              : album.image[2]["#text"],
          url: album.url
        }))
      });

      if (this.searchInputRef.current) {
        this.searchInputRef.current.value = "";
      }
    }
  };

  fetchMore = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
        moreResultsLoading: true
      }),
      async () => {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.search&album=` +
            this.state.searchTerm +
            `&api_key=a09702ee21fe630efc366adf3c546342&format=json&limit=20&page=` +
            this.state.page
        );

        const results = await response.json();

        this.setState({
          moreResultsLoading: false
        });

        let index = this.state.tracks.reduce(
          (max, track) => (track.id > max ? track.id : max),
          this.state.tracks[0].id
        ) + 1;

        this.setState(prevState => ({
          ...prevState,
          tracks: prevState.tracks.concat(
            results.results.albummatches.album.map((album: any) => ({
              id: index++,
              title: "Song name" + index,
              length: "2:58",
              genre: "hip-hop",
              albumName: album.name,
              artist: album.artist,
              imageSrc:
                album.image[2]["#text"] === ""
                  ? MissingImage
                  : album.image[2]["#text"],
              url: album.url
            }))
          )
        }));
      }
    );
  };

  render() {
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
            <div className="col-md-12 col-lg-3">
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

        @media only screen and (max-width: 768px) {
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
