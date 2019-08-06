import React from "react";
import styled from "styled-components";
import DownloadLogo from "common/images/download.svg";
import ExportLogo from "common/images/export.svg";
import ReactAudioPlayer from "react-audio-player";
import { Song, SongsAPI } from "common/api/songs";
import { millisToMinutesAndSeconds } from "common/api/utilities";
import { Loading } from "common/components/Loading";
import {
  lightGray,
  lightBlue,
  blue,
  darkerGray,
  white,
  gray,
  black
} from "common/styles/colors";
import { StyledButton } from "common/components/Button.styles";
import { Resource } from "common/components/Resource";
import { lighten } from "polished";
import { PrimitivesAPI } from "common/api/primitives";
import { PrimitiveCheckboxModel } from "search-page/common/models/checkboxModel";
import {
  ExportCsvAPI,
  Export,
  ExportSuperPrimitive
} from "common/api/exportcsv";
import AppContext from "AppContext";
import { SpectrogramAPI } from "common/api/spectrogram";

type State = {
  track: Song | null;
  selectedPrimitives: string[];
  allPrimitives: PrimitiveCheckboxModel[];
  spectrogram: string;
};

export class TrackApp extends React.PureComponent<{ match: any }, State> {
  songsApi: SongsAPI = new SongsAPI();
  primitivesAPI: PrimitivesAPI = new PrimitivesAPI();
  exportCsvAPI: ExportCsvAPI = new ExportCsvAPI();
  spectrogramAPI: SpectrogramAPI = new SpectrogramAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      track: null,
      selectedPrimitives: [],
      allPrimitives: [],
      spectrogram: ""
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const allPrimitives = await this.primitivesAPI
      .getPrimitives()
      .then(data => data.data.primitives as PrimitiveCheckboxModel[]);

    const selectedPrimitives = allPrimitives
      .filter(x => x.is_selected)
      .map(x => x.name);

    const track = await this.songsApi.getSong(id).then(
      data =>
        ({
          ...data.data,
          duration: millisToMinutesAndSeconds(
            Number(data.data.primitives[0][1])
          )
        } as Song)
    );

    const response = await this.spectrogramAPI
      .getSpectrogram({ song_id: track.id })
      .then(data => data);

    const imgFile = new Blob([response.data]);
    const spectrogram = URL.createObjectURL(imgFile);

    this.setState({
      track,
      selectedPrimitives,
      allPrimitives,
      spectrogram
    });
  }

  selectPrimitive = (e: React.SyntheticEvent<HTMLTableRowElement>) => {
    if (e.currentTarget.classList.contains("selected")) {
      e.currentTarget.classList.remove("selected");
      return;
    }

    if (e.currentTarget.parentElement) {
      const primitiveRows = e.currentTarget.parentElement.querySelectorAll<
        HTMLTableRowElement
      >(".primitiveRow");
      primitiveRows.forEach(x => x.classList.remove("selected"));
    }

    e.currentTarget.classList.add("selected");
  };

  getSuperPrimitive = (trackId: number, super_primitive: string) => async (
    e: React.SyntheticEvent<HTMLTableDataCellElement>
  ) => {
    e.stopPropagation();
    const song_ids = [trackId];
    const primitive = this.state.allPrimitives.find(
      x => x.name === super_primitive
    );

    if (primitive) {
      const primitive_id = primitive.id;
      const csv = await this.exportCsvAPI
        .getSuperPrimitiveCsv({
          song_ids,
          primitive_id
        } as ExportSuperPrimitive)
        .then(data => data.data);

      this.download(csv, primitive.name + "-" + trackId);
    }
  };

  exportCSV = (trackId: number, unselectedPrimitiveIdList: number[]) => async (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    const song_ids = [trackId];
    const primitive_ids = this.state.allPrimitives
      .filter(
        x =>
          this.state.selectedPrimitives.includes(x.name) &&
          !unselectedPrimitiveIdList.includes(x.id) &&
          !x.is_super_primitive
      )
      .map(x => x.id);

    const csv = await this.exportCsvAPI
      .getCsv({ song_ids, primitive_ids } as Export)
      .then(data => data.data);

    this.download(csv, "data-" + trackId);
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
    const { track, allPrimitives, spectrogram } = this.state;

    if (!track) {
      return <Loading />;
    }

    return (
      <StyledTrackApp className="container">
        <div className="trackContainer row">
          <div className="col-lg-3 pl-0 pr-0 trackImage">
            <img src={track.art} alt={track.title + " album picture"} />
          </div>
          <div className="col-lg-9 pl-0 pr-0">
            <div className="exportButtonContainer">
              <AppContext.Consumer>
                {context => (
                  <StyledExportToCsvButton
                    className="float-right"
                    onClick={this.exportCSV(
                      track.id,
                      context.unselectedPrimitiveIdList
                    )}
                  >
                    <img src={ExportLogo} alt="Export logo" />
                    <Resource resourceKey="exportToCsv" />
                  </StyledExportToCsvButton>
                )}
              </AppContext.Consumer>
            </div>
            <div className="artist">{track.artist}</div>
            <div>
              <span className="title">{track.title}</span>
              <div className="float-right genre">{track.genre}</div>
            </div>
            <div className="album">{track.album}</div>
            {track.sound && <ReactAudioPlayer src={track.sound} controls />}
          </div>
        </div>

        {spectrogram !== "" && (
          <div className="spectrogram">
            <img src={spectrogram} alt="Spectrogram" />
          </div>
        )}
        <div className="primitivesContainer row">
          <div className="col-lg-6">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "150px" }}>
                    <Resource resourceKey="primitive" />
                  </th>
                  <th>
                    <Resource resourceKey="value" />
                  </th>
                  <th style={{ width: "24px" }} />
                </tr>
              </thead>
              <AppContext.Consumer>
                {context => (
                  <tbody>
                    {track.primitives
                      .filter((x: any) =>
                        allPrimitives
                          .filter(
                            x =>
                              x.is_selected &&
                              !context.unselectedPrimitiveIdList.includes(x.id)
                          )
                          .map(x => x.name)
                          .includes(x[0])
                      )
                      .map((primitive: any) => (
                        <tr
                          key={primitive[0]}
                          className="clickable primitiveRow"
                          id={primitive[0]}
                          onClick={this.selectPrimitive}
                        >
                          <td>{primitive[0]}</td>
                          <td>
                            <div className="primitiveContent">
                              {primitive[1]}
                            </div>
                          </td>
                          <td
                            onClick={
                              this.state.allPrimitives
                                .filter(
                                  x =>
                                    x.is_super_primitive &&
                                    x.name !== "estimated_tempo"
                                )
                                .map(x => x.name)
                                .includes(primitive[0])
                                ? this.getSuperPrimitive(track.id, primitive[0])
                                : undefined
                            }
                          >
                            {this.state.allPrimitives
                              .filter(
                                x =>
                                  x.is_super_primitive &&
                                  x.name !== "estimated_tempo"
                              )
                              .map(x => x.name)
                              .includes(primitive[0]) && (
                              <img src={DownloadLogo} alt="Download" />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </AppContext.Consumer>
            </table>
          </div>
        </div>
      </StyledTrackApp>
    );
  }
}

const StyledExportToCsvButton = styled(StyledButton)`
  height: 32px !important;
  background-color: ${white};
  font-weight: normal;

  img {
    margin-right: 5px;
  }
`;

const StyledTrackApp = styled.div`
  .spectrogram {
    text-align: center;
    box-shadow: 0 0 2px 2px ${lightGray};
    margin-top: 20px;

    img {
      max-width: 100%;
    }
  }

  .trackContainer {
    padding: 20px;
    margin-top: 20px;
    margin-left: 0;
    margin-right: 0;
    background-color: ${lightGray};

    audio {
      width: 100%;
    }

    audio::-webkit-media-controls-panel {
      border-radius: 0;
      padding: 0;
      margin: 0;
    }

    .exportButtonContainer {
      height: 32px;
    }

    .trackImage {
      img {
        width: 210px;
        height: 210px;
      }

      @media only screen and (max-width: 991px) {
        text-align: center;
        margin-bottom: 20px;
      }
    }

    .artist {
      font-size: 16px;
      font-weight: bold;
    }

    .title {
      font-size: 30px;
      font-weight: bold;
    }

    .genre {
      padding: 3px 10px;
      background-color: ${lightBlue};
      color: ${blue}
      font-weight: bold;
      text-transform: uppercase;
    }

    .album {
      font-size: 16px;
      color: ${darkerGray};
    }
  }

  .primitivesContainer {
    margin-top: 20px;

    table {
      width: 100%;

      thead {
        border-bottom: 1px solid ${gray};
        text-transform: uppercase;
        color: ${darkerGray};
        
        th {
          padding: 9px;
          font-size: 12px;
          font-weight: bold;
        }
      }
  
      tbody {
        td {
          vertical-align: top;
          padding: 9px;

          img {
            height: 16px;
            width: 16px;
          }
        }

        .primitiveContent {
          max-height: 50px;
          overflow: hidden;
        }

        .selected {
          font-weight: bold;

          .primitiveContent {
            max-height: initial;
          }
        }

        tr:nth-child(even) {background-color: ${lightGray}}
      }
    }

    .graph {
      box-shadow: 0 2px 10px ${lighten(0.85, black)};
      margin-top: 34px;
      display: inline-table;

      .primitiveName {
        font-size: 17px;
        padding-top: 13px;
        padding-bottom: 13px;
        text-transform: uppercase;
        border-bottom: 1px solid ${gray};
      }

      .primitiveDetails {
        margin-top: 13px;

        .description {
          padding: 0 15px 15px 15px;
        }

        .graphPrimitive {
          margin-bottom: 13px;
        }
      }
    }
  }
`;
