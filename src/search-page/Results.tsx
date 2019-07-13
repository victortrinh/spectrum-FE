import React from "react";
import styled from "styled-components";
import ExportLogo from "common/images/export.svg";
import DotLogo from "common/images/dot.svg";
import PlayButton from "common/images/Play.png";
import ReactLoading from "react-loading";
import BottomScrollListener from "react-bottom-scroll-listener";
import { Resource } from "common/components/Resource";
import {
  gray,
  lightBlue,
  blue,
  darkerGray,
  darkGray,
  black
} from "common/styles/colors";
import { StyledButton } from "common/components/Button.styles";
import { Song } from "common/api/songs";
import { Redirect } from "react-router";
import AppContext from "AppContext";

type OwnProps = {
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: number;
  enteredSearchTerm: string;
  tracks: Song[];
  fetchMore: () => void;
  searched: boolean;
};

type State = {
  trackId: string | null;
};

type Props = OwnProps;

export class Results extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      trackId: null
    };
  }

  goToTrack = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const trackId = e.currentTarget.id;

    this.setState({
      trackId
    });
  };

  render() {
    const {
      tracks,
      totalResults,
      enteredSearchTerm,
      isLoading,
      fetchMore,
      moreResultsLoading,
      searched
    } = this.props;

    const { trackId } = this.state;

    if (trackId) {
      const redirectUrl = "/track/" + trackId;
      return <Redirect push to={redirectUrl} />;
    }

    let content;

    const loadingComponent = (
      <>
        <ReactLoading
          className="loading"
          type="spinningBubbles"
          color={black}
          height={80}
          width={100}
        />
        <div className="loadingText text-center mt-4">
          <Resource resourceKey="contentLoading" />
        </div>
      </>
    );

    if (isLoading) {
      content = loadingComponent;
    } else if (!searched && totalResults === 0) {
      content = (
        <div className="mainHeader">
          <Resource resourceKey="doASearch" />
        </div>
      );
    } else if (searched && totalResults === 0) {
      content = (
        <div className="mainHeader">
          <Resource resourceKey="noResults" />
        </div>
      );
    } else {
      content = (
        <>
          <div className="mainHeader">
            {enteredSearchTerm !== "" && (
              <>
                <Resource resourceKey="searchResults" /> "{enteredSearchTerm}"
              </>
            )}

            <span className="totalResults">
              {totalResults} <Resource resourceKey="tracks" />
            </span>
            <StyledExportToCsvButton>
              <img src={ExportLogo} alt="Export logo" />
              <Resource resourceKey="exportToCsv" />
            </StyledExportToCsvButton>
          </div>
          <div id="tracks">
            {tracks.map(track => (
              <div
                key={track.id}
                id={track.id.toString()}
                className="track row"
                onClick={this.goToTrack}
              >
                <AppContext.Consumer>
                  {context => (
                    <div
                      className="col-2 trackImage"
                      data-track={track}
                      onClick={context.setPlayedTrack(track)}
                    >
                      <img
                        className="albumImage"
                        src={track.image_src}
                        alt="Album"
                      />
                      <img className="playButton" src={PlayButton} alt="Play" />
                    </div>
                  )}
                </AppContext.Consumer>
                <div className="col-10 allTrackDetails">
                  <div className="interior">
                    <div>
                      <span className="trackName">{track.title}</span>
                      <span className="trackLength">{track.duration}</span>
                    </div>
                    <div className="bottomSection">
                      <span className="trackGenre">{track.genre}</span>
                      <span className="trackDetails">
                        {track.artist}
                        <img src={DotLogo} alt="dot" />
                        {track.album}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {moreResultsLoading && loadingComponent}
          <BottomScrollListener onBottom={fetchMore} />
        </>
      );
    }

    return <StyledResults>{content}</StyledResults>;
  }
}

const StyledResults = styled.div`
  .mainHeader {
    font-size: 22px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid ${gray};

    @media only screen and (max-width: 992px) {
      margin-top: 30px;
    }

    img {
      padding-right: 7px;
      margin-bottom: 3px;
    }
  }

  .totalResults {
    padding-left: 5px;
    color: ${darkGray};
  }

  #tracks {
    padding: 10px;

    .col-* {
      padding: 0 !important;
    }

    .track {
      padding: 10px 0;

      .trackImage {
        position: relative;

        .albumImage {
          height: 80px;
          width: 80px;
        }

        .playButton {
          position: absolute;
          display: none;
          top: 30%;
          left: 40px;
          z-index: 100;
        }

        @media only screen and (max-width: 767px) {
          .albumImage {
            height: 60px;
            width: 60px;
          }

          .playButton {
            left: 30px;
          }
        }
      }

      .trackImage:hover {
        cursor: pointer;

        .playButton {
          display: block;
        }
      }

      .allTrackDetails {
        min-height: 80px;
        padding-left: 0;

        @media only screen and (max-width: 767px) {
          min-height: 60px;
          padding-left: 20px;
        }

        @media only screen and (max-width: 600px) {
          padding-left: 30px;
        }

        display: flex;
        align-items: center;

        .interior {
          width: 100%;

          .trackName {
            font-weight: bold;
            font-size: 16px;
          }
  
          .trackLength {
            float: right;
          }
  
          .bottomSection {
            margin-top: 10px;

            .trackGenre {
              padding: 2px 5px;
              background-color: ${lightBlue};
              color: ${blue}
              font-weight: bold;
              text-transform: uppercase;
            }

            .trackDetails {
              margin-left: 15px;
              color: ${darkerGray}

              img {
                padding: 0 8px;
              }
            }
          }
        }
      }
    }

    .track:not(:first-child) {
      border-top: 1px solid ${gray};
    }

    .track:hover {
      cursor: pointer;
      border-top: 0;
      box-shadow: -1px 3px 6px #ccc;
      border-radius: 3px;
    }
  }
`;

const StyledExportToCsvButton = styled(StyledButton)`
  height: 32px !important;

  @media only screen and (min-width: 767px) {
    float: right;
  }

  font-weight: normal;
`;
