import React, { createRef } from "react";
import styled from "styled-components";
import ExportLogo from "common/images/export.svg";
import DotLogo from "common/images/dot.svg";
import PlayButton from "common/images/Play.png";
import DownloadIcon from "common/images/download.svg";
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
import { ModalApp } from "common/components/ModalApp";
import { StyledInput } from "common/components/Form.styles";
import { PrimitiveCheckboxModel } from "./common/models/checkboxModel";
import { PrimitivesAPI } from "common/api/primitives";
import {
  ExportSuperPrimitive,
  ExportCsvAPI,
  Export
} from "common/api/exportcsv";
import { Loading } from "common/components/Loading";

type OwnProps = {
  isLoading: boolean;
  moreResultsLoading: boolean;
  totalResults: number;
  enteredSearchTerm: string;
  allFilteredTracks: Song[];
  tracks: Song[];
  fetchMore: () => void;
  searched: boolean;
  unselectedGenreIdList: number[];
  unselectedPrimitiveIdList: number[];
};

type State = {
  isLoading: boolean;
  trackId: string | null;
  isOpen: boolean;
  isModalValid: boolean;
  selectedPrimitives: PrimitiveCheckboxModel[];
};

type Props = OwnProps;

export class Results extends React.Component<Props, State> {
  primitivesAPI: PrimitivesAPI = new PrimitivesAPI();
  exportCsvAPI: ExportCsvAPI = new ExportCsvAPI();
  private genresTable = createRef<HTMLTableElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      trackId: null,
      isOpen: false,
      isModalValid: true,
      selectedPrimitives: []
    };
  }

  async componentDidMount() {
    const allPrimitives = await this.primitivesAPI
      .getPrimitives()
      .then(data => data.data.primitives as PrimitiveCheckboxModel[]);

    const selectedPrimitives = allPrimitives.filter(x => x.is_selected);

    this.setState({
      selectedPrimitives
    });
  }

  validateModal = (): boolean => {
    if (this.genresTable.current) {
      const errors = this.genresTable.current.querySelectorAll<
        HTMLInputElement
      >(".error");

      this.setState({
        isModalValid: errors.length === 0
      });

      return errors.length === 0;
    }

    this.setState({
      isModalValid: true
    });

    return true;
  };

  goToTrack = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const trackId = e.currentTarget.id;

    this.setState({
      trackId
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      ...prevState,
      isOpen: !prevState.isOpen
    }));
  };

  onSave = async () => {
    if (this.validateModal()) {
      await this.exportCSV();

      this.setState({
        isOpen: false
      });
    }
  };

  occurrence = (array: string[]) => {
    let a = [],
      b = [] as number[],
      prev;

    array.sort();
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== prev) {
        a.push(array[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = array[i];
    }

    return a.map((x, i) => ({
      name: x,
      number: b[i]
    }));
  };

  getTracks = (): Song[] => {
    if (this.genresTable.current) {
      const inputs = this.genresTable.current.querySelectorAll<
        HTMLInputElement
      >("input");
      const genres = [] as any;
      inputs.forEach(x => genres.push({ name: x.id, value: x.value }));
      const tracks = [] as Song[];
      genres.forEach((x: any) =>
        this.props.allFilteredTracks
          .filter(a => a.genre === x.name)
          .slice(0, Number(x.value))
          .forEach(x => tracks.push(x))
      );
      return tracks;
    }

    return [];
  };

  exportCSV = async () => {
    const song_ids = this.getTracks().map(x => x.id);

    const primitive_ids = this.state.selectedPrimitives
      .filter(x => !x.is_super_primitive)
      .map(x => x.id);

    const csv = await this.exportCsvAPI
      .getCsv({ song_ids, primitive_ids } as Export)
      .then(data => data.data);

    this.download(csv, "data");
  };

  exportSuperPrimitive = (primitive: PrimitiveCheckboxModel) => async () => {
    const song_ids = this.getTracks().map(x => x.id);

    this.setState({
      isLoading: true
    });

    const csv = await this.exportCsvAPI
      .getSuperPrimitiveCsv({
        song_ids,
        primitive_id: primitive.id
      } as ExportSuperPrimitive)
      .then(data => data.data);

    this.setState({
      isLoading: false
    });

    this.download(csv, primitive.name);
  };

  download = (csv: any, name: string) => {
    const link = document.createElement("a");
    link.href = `data:text/csv,${encodeURI(csv)}`;
    link.download = name + `.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    const {
      tracks,
      totalResults,
      enteredSearchTerm,
      isLoading,
      fetchMore,
      moreResultsLoading,
      searched,
      allFilteredTracks
    } = this.props;

    const { trackId, isOpen, selectedPrimitives, isModalValid } = this.state;

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
          <AppContext.Consumer>
            {context => (
              <ModalApp
                saveButton={context.getResource("export")}
                cancelButton={context.getResource("cancel")}
                title={context.getResource("exportCsv")}
                onSave={this.onSave}
                toggle={this.toggle}
                isOpen={isOpen}
              >
                {this.state.isLoading && <Loading />}
                <Resource resourceKey="changeNumberGenres" />
                {!isModalValid && (
                  <div className="mt-2 alert alert-danger">
                    <Resource resourceKey="errorModal" />
                  </div>
                )}
                <table ref={this.genresTable} className="w-100 mt-2 mb-2">
                  <thead>
                    <tr>
                      <th>
                        <Resource resourceKey="genre" />
                      </th>
                      <th>
                        <Resource resourceKey="currentNumber" />
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody id="genresBeforeExport">
                    {this.occurrence(allFilteredTracks.map(x => x.genre)).map(
                      (x: any) => (
                        <tr key={x.name}>
                          <td className="text-uppercase">{x.name}</td>
                          <td align="center">{x.number}</td>
                          <td>
                            <StyledInput
                              id={x.name}
                              type="number"
                              defaultValue={x.number}
                              onBlur={this.validateModal}
                              onChange={(
                                e: React.SyntheticEvent<HTMLInputElement>
                              ) => {
                                if (
                                  e.currentTarget.value > x.number ||
                                  e.currentTarget.value < "0"
                                ) {
                                  e.currentTarget.classList.add("error");
                                } else {
                                  e.currentTarget.classList.remove("error");
                                }
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div>
                  <span className="font-weight-bold">
                    <Resource resourceKey="primitives" /> :{" "}
                  </span>
                  {selectedPrimitives
                    .filter(
                      x =>
                        !this.props.unselectedPrimitiveIdList.includes(x.id) &&
                        !x.is_super_primitive
                    )
                    .map((x, i) => {
                      if (
                        i ===
                        selectedPrimitives.filter(
                          x =>
                            !this.props.unselectedPrimitiveIdList.includes(
                              x.id
                            ) && !x.is_super_primitive
                        ).length -
                          1
                      ) {
                        return (
                          <span className="text-uppercase" key={x.id}>
                            {x.name}
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-uppercase" key={x.id}>
                            {x.name},{" "}
                          </span>
                        );
                      }
                    })}
                  {selectedPrimitives.some(
                    x =>
                      !this.props.unselectedPrimitiveIdList.includes(x.id) &&
                      x.is_super_primitive &&
                      x.name !== "estimated_tempo"
                  ) && (
                    <table style={{ marginTop: "20px" }}>
                      <thead>
                        <tr>
                          <th>
                            <Resource resourceKey="superPrimitives" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrimitives
                          .filter(
                            x =>
                              !this.props.unselectedPrimitiveIdList.includes(
                                x.id
                              ) &&
                              x.is_super_primitive &&
                              x.name !== "estimated_tempo"
                          )
                          .map(primitive => (
                            <tr key={primitive.name}>
                              <td style={{ textTransform: "uppercase" }}>
                                {primitive.name}
                              </td>
                              <td
                                className="clickable"
                                onClick={this.exportSuperPrimitive(primitive)}
                                style={{ paddingLeft: "16px" }}
                              >
                                <img
                                  style={{ width: "16px", height: "16px" }}
                                  src={DownloadIcon}
                                  alt="Download"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </ModalApp>
            )}
          </AppContext.Consumer>

          <div className="mainHeader">
            {enteredSearchTerm !== "" && (
              <>
                <Resource resourceKey="searchResults" /> "{enteredSearchTerm}"
              </>
            )}
            <span className="totalResults">
              {totalResults} <Resource resourceKey="tracks" />
            </span>
            <StyledExportToCsvButton onClick={this.toggle}>
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
                    <div className="col-2 trackImage" data-track={track}>
                      <img className="albumImage" src={track.art} alt="Album" />
                      {track.sound && (
                        <img
                          onClick={context.setPlayedTrack(track)}
                          className="playButton"
                          src={PlayButton}
                          alt="Play"
                        />
                      )}
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
