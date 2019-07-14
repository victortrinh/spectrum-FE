import React from "react";
import styled from "styled-components";
import ReactAudioPlayer from "react-audio-player";
import { primaryColor, white, black, darkerGray } from "common/styles/colors";
import { lighten } from "polished";
import { Song } from "common/api/songs";

type Props = {
  track: Song | null;
};

export class AudioPlayer extends React.PureComponent<Props> {
  render() {
    const { track } = this.props;

    if (!track) {
      return <></>;
    }

    return (
      <StyledAudioPlayer>
        <div className="container">
          <div className="row ml-0 mr-0">
            <div className="col-sm-7 audioContainer">
              {track.sound && (
                <ReactAudioPlayer src={track.sound} autoPlay controls />
              )}
            </div>
            <div className="col-sm-5 trackInfo row ml-0 mr-0">
              <div className="col-sm-2 image">
                <img src={track.art} alt="Album" />
              </div>
              <div className="col-sm-10 theTrack">
                <div className="trackName">{track.title}</div>
                <div className="trackAlbumAndArtist">
                  <span className="artist">{track.artist}</span>
                  {track.album}
                </div>
              </div>
            </div>
          </div>
        </div>
      </StyledAudioPlayer>
    );
  }
}

const StyledAudioPlayer = styled.div`
  height: 60px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: ${white};
  box-shadow: -1px -3px 6px ${lighten(0.84, black)};

  .audioContainer {
    position: relative;

    audio {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 95%;
    }

    audio::-webkit-media-controls-panel {
      background-color: ${white};
      border-radius: 0;
    }

    audio::-webkit-media-controls-play-button {
      color: ${primaryColor} !important;
    }

    audio::-webkit-media-controls-current-time-display {
      color: ${primaryColor};
    }

    audio::-webkit-media-controls-timeline {
      color: ${primaryColor};
    }
  }

  .trackInfo {
    position: relative;

    .image {
      padding-right: 0;
    }

    img {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 10px;
      left: 0;
      border-radius: 50%;
    }

    .theTrack {
      height: 60px;
      padding-top: 10px;
      padding-left: 0;

      .trackName {
        font-size: 14px;
        font-weight: bold;
      }

      .trackAlbumAndArtist {
        font-size: 12px;
        color: ${darkerGray};
        white-space: nowrap;

        .artist {
          margin-right: 8px;
        }
      }
    }
  }
`;
