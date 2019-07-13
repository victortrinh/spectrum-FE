import React from "react";
import styled from "styled-components";
import ExportLogo from "common/images/export.svg";
import GraphPic from "common/images/graph_demo.png";
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

type State = {
  track: Song | null;
  selectedPrimitive: string;
};

export class TrackApp extends React.PureComponent<{ match: any }, State> {
  songsApi: SongsAPI = new SongsAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      track: null,
      selectedPrimitive: ""
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const track = await this.songsApi.getSong(id).then(
      data =>
        ({
          ...data.data,
          image_src:
            "https://i.scdn.co/image/966ade7a8c43b72faa53822b74a899c675aaafee",
          duration: millisToMinutesAndSeconds(
            Number(data.data.primitives[0][1])
          ),
          album: "TODO ADD ALBUM",
          preview_url:
            "https://p.scdn.co/mp3-preview/229bb6a4c7011158cc7e1aff11957e274dc05e84?cid=774b29d4f13844c495f206cafdad9c86"
        } as Song)
    );

    this.setState({
      track
    });
  }

  selectPrimitive = (e: React.SyntheticEvent<HTMLTableRowElement>) => {
    const selectedPrimitive = e.currentTarget.id;

    if (e.currentTarget.parentElement) {
      const primitiveRows = e.currentTarget.parentElement.querySelectorAll<
        HTMLTableRowElement
      >(".primitiveRow");
      primitiveRows.forEach(x => x.classList.remove("selected"));
    }

    e.currentTarget.classList.add("selected");

    this.setState({
      selectedPrimitive
    });
  };

  render() {
    const { track, selectedPrimitive } = this.state;

    if (!track) {
      return <Loading />;
    }

    return (
      <StyledTrackApp className="container">
        <div className="trackContainer row">
          <div className="col-lg-3 pl-0 pr-0 trackImage">
            <img src={track.image_src} alt={track.title + " album picture"} />
          </div>
          <div className="col-lg-9 pl-0 pr-0">
            <div className="exportButtonContainer">
              <StyledExportToCsvButton className="float-right">
                <img src={ExportLogo} alt="Export logo" />
                <Resource resourceKey="exportToCsv" />
              </StyledExportToCsvButton>
            </div>
            <div className="artist">{track.artist}</div>
            <div>
              <span className="title">{track.title}</span>
              <div className="float-right genre">{track.genre}</div>
            </div>
            <div className="album">{track.album}</div>
          </div>
        </div>
        <div className="primitivesContainer row mr-0 ml-0">
          <div className="col-lg-3">
            <table>
              <thead>
                <tr>
                  <th>
                    <Resource resourceKey="primitive" />
                  </th>
                  <th>
                    <Resource resourceKey="value" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {track.primitives.map((primitive: any) => (
                  <tr
                    className="clickable primitiveRow"
                    id={primitive[0]}
                    onClick={this.selectPrimitive}
                  >
                    <td>{primitive[0]}</td>
                    <td>{primitive[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedPrimitive !== "" && (
            <div className="col-lg-9 graph">
              <div className="primitiveName text-center">
                {selectedPrimitive}
              </div>
              <div className="row primitiveDetails">
                <div className="col-lg-5 description">
                  The estimated overall key of the track. Integers map to
                  pitches using standard Pitch Class notation . E.g. 0 = C, 1 =
                  C♯/D♭, 2 = D, and so on. If no key was detected, the value is
                  -1.
                </div>
                <div className="col-lg-7 graphPrimitive">
                  <img src={GraphPic} alt="Primitive chart" />
                </div>
              </div>
            </div>
          )}
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
  .trackContainer {
    padding: 20px;
    margin-top: 20px;
    margin-left: 0;
    margin-right: 0;
    background-color: ${lightGray};

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
          padding: 9px;
        }

        .selected {
          font-weight: bold;
        }

        tr:nth-child(even) {background-color: ${lightGray}}
      }
    }

    .graph {
      box-shadow: 0 2px 10px ${lighten(0.85, black)};
      margin-top: 34px;

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
          padding-left: 30px;
        }
      }
    }
  }
`;
