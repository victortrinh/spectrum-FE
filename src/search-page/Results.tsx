import React from "react";
import styled from "styled-components";
import ExportLogo from "common/images/export.svg";
import DotLogo from "common/images/dot.svg";
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
import { TrackModel } from "./common/models/trackModel";

type OwnProps = {
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: string;
  enteredSearchTerm: string;
  tracks: TrackModel[];
  fetchMore: () => void;
};

type Props = OwnProps;

export class Results extends React.Component<Props> {
  render() {
    const {
      tracks,
      totalResults,
      enteredSearchTerm,
      isLoading,
      fetchMore,
      moreResultsLoading
    } = this.props;

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
    } else if (enteredSearchTerm === "" || !/\S/.test(enteredSearchTerm)) {
      content = (
        <div className="mainHeader">
          <Resource resourceKey="doASearch" />
        </div>
      );
    } else if (totalResults === "0") {
      content = (
        <div className="mainHeader">
          <Resource resourceKey="noResults" />
        </div>
      );
    } else {
      content = (
        <>
          <div className="mainHeader">
            <Resource resourceKey="searchResults" /> "{enteredSearchTerm}"
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
              <div key={track.id} className="track row">
                <div className="col-2 trackImage">
                  <img src={track.imageSrc} alt="Album" />
                </div>
                <div className="col-10 allTrackDetails">
                  <div className="interior">
                    <div>
                      <span className="trackName">{track.title}</span>
                      <span className="trackLength">{track.length}</span>
                    </div>
                    <div className="bottomSection">
                      <span className="trackGenre">{track.genre}</span>
                      <span className="trackDetails">
                        {track.artist}
                        <img src={DotLogo} alt="dot" />
                        {track.albumName}
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

  .loading {
    margin: auto;
    padding: 10px;
  }

  .loadingText {
    font-size: 20px;
    font-weight: bold;
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
        img {
          height: 80px;
          width: 80px;
        }

        @media only screen and (max-width: 768px) {
          img {
            height: 60px;
            width: 60px;
          }
        }
      }

      .allTrackDetails {
        min-height: 80px;
        padding-left: 0;

        @media only screen and (max-width: 768px) {
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

  @media only screen and (min-width: 768px) {
    float: right;
  }

  font-weight: normal;
`;
