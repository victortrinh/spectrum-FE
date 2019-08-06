import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import DeleteIcon from "common/images/delete.svg";
import { Loading } from "common/components/Loading";
import { SongsAPI, Song } from "common/api/songs";
import { millisToMinutesAndSeconds } from "common/api/utilities";
import { Resource } from "common/components/Resource";
import { gray, white, lightGray } from "common/styles/colors";
import { LastFmAPI } from "common/api/lastfm";
import { StyledInput } from "common/components/Form.styles";
import { StyledButton } from "common/components/Button.styles";
import { CrawlerNbGenre, CrawlerGenre, CrawlerAPI } from "common/api/crawler";

type State = {
  tracksLoading: boolean;
  tracksDB: Song[];
  numberOfSongs: number;
  lastFmTopTags: string[];
  selectedGenre: string;
  crawlerNbGenre: CrawlerNbGenre;
  crawlerGenre: CrawlerGenre;
  errorCrawlerNbGenre: boolean;
  errorCrawlerGenre: boolean;
};

export class AddSongsApp extends React.PureComponent<{}, State> {
  songsAPI: SongsAPI = new SongsAPI();
  lastFmAPI: LastFmAPI = new LastFmAPI();
  crawlerAPI: CrawlerAPI = new CrawlerAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      tracksLoading: true,
      tracksDB: [],
      lastFmTopTags: [],
      numberOfSongs: 0,
      selectedGenre: "",
      crawlerNbGenre: {
        nb_genres: 0,
        nb_songs_per_genre: 0
      },
      crawlerGenre: {
        genre: "",
        nb_songs: 0
      },
      errorCrawlerNbGenre: true,
      errorCrawlerGenre: true
    };
  }

  async componentDidMount() {
    let tracksDB = JSON.parse(sessionStorage.getItem(
      "tracksDB"
    ) as string) as any;

    if (!tracksDB) {
      tracksDB = await this.songsAPI.getSongs().then(data => {
        return data.data.songs.map(
          (song: Song) =>
            ({
              ...song,
              duration: millisToMinutesAndSeconds(Number(song.primitives[0][1]))
            } as Song)
        );
      });

      tracksDB.sort((a: Song, b: Song) => {
        if (a.genre < b.genre) {
          return -1;
        }
        if (a.genre > b.genre) {
          return 1;
        }
        return 0;
      });

      sessionStorage.setItem("tracksDB", JSON.stringify(tracksDB));
    }

    const lastFmTopTagsJson = await this.lastFmAPI.getTopTags();
    const lastFmTopTags = lastFmTopTagsJson.toptags.tag.map((x: any) => x.name);

    this.setState({
      tracksDB,
      tracksLoading: false,
      numberOfSongs: tracksDB.length,
      lastFmTopTags
    });
  }

  onChangeNbGenre = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    this.setState(
      prevState => ({
        ...prevState,
        crawlerNbGenre: {
          ...prevState.crawlerNbGenre,
          nb_genres: value
        }
      }),
      () => this.checkErrorNbGenre()
    );
  };

  onChangeNbSongsPerGenre = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    this.setState(
      prevState => ({
        ...prevState,
        crawlerNbGenre: {
          ...prevState.crawlerNbGenre,
          nb_songs_per_genre: value
        }
      }),
      () => this.checkErrorNbGenre()
    );
  };

  onChangeNbSongsForGenre = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    this.setState(
      prevState => ({
        ...prevState,
        crawlerGenre: {
          genre: prevState.selectedGenre,
          nb_songs: value
        }
      }),
      () => this.checkErrorGenre()
    );
  };

  checkErrorNbGenre = () => {
    if (
      this.state.crawlerNbGenre.nb_genres === 0 ||
      this.state.crawlerNbGenre.nb_songs_per_genre === 0
    ) {
      this.setState({
        errorCrawlerNbGenre: true
      });
    } else {
      this.setState({
        errorCrawlerNbGenre: false
      });
    }
  };

  checkErrorGenre = () => {
    if (
      this.state.crawlerGenre.genre === "" ||
      this.state.crawlerGenre.nb_songs === 0
    ) {
      this.setState({
        errorCrawlerGenre: true
      });
    } else {
      this.setState({
        errorCrawlerGenre: false
      });
    }
  };

  addSongsForGenre = async () => {
    if (!this.state.errorCrawlerGenre) {
      this.setState({
        tracksLoading: true
      });

      await this.crawlerAPI.crawlByGenre(this.state.crawlerGenre);

      const tracksDB = await this.songsAPI.getSongs().then(data => {
        return data.data.songs.map(
          (song: Song) =>
            ({
              ...song,
              duration: millisToMinutesAndSeconds(Number(song.primitives[0][1]))
            } as Song)
        );
      });

      tracksDB.sort((a: Song, b: Song) => {
        if (a.genre < b.genre) {
          return -1;
        }
        if (a.genre > b.genre) {
          return 1;
        }
        return 0;
      });

      sessionStorage.setItem("tracksDB", JSON.stringify(tracksDB));

      this.setState({
        tracksDB,
        tracksLoading: false,
        numberOfSongs: tracksDB.length
      });
    }
  };

  addSongsByNumberGenre = async () => {
    if (!this.state.errorCrawlerNbGenre) {
      this.setState({
        tracksLoading: true
      });

      await this.crawlerAPI.crawlByNbGenre(this.state.crawlerNbGenre);

      const tracksDB = await this.songsAPI.getSongs().then(data => {
        return data.data.songs.map(
          (song: Song) =>
            ({
              ...song,
              duration: millisToMinutesAndSeconds(Number(song.primitives[0][1]))
            } as Song)
        );
      });

      tracksDB.sort((a: Song, b: Song) => {
        if (a.genre < b.genre) {
          return -1;
        }
        if (a.genre > b.genre) {
          return 1;
        }
        return 0;
      });

      sessionStorage.setItem("tracksDB", JSON.stringify(tracksDB));

      this.setState({
        tracksDB,
        tracksLoading: false,
        numberOfSongs: tracksDB.length
      });
    }
  };

  deleteSong = (trackId: number) => async () => {
    await this.songsAPI.deleteSong({ id: trackId });

    this.setState(prevState => ({
      ...prevState,
      tracksDB: prevState.tracksDB.filter(x => x.id !== trackId),
      numberOfSongs: prevState.numberOfSongs - 1
    }));

    sessionStorage.removeItem("tracksDB");
  };

  selectGenre = (genre: string) => () => {
    this.setState({
      selectedGenre: genre
    });
  };

  render() {
    const {
      tracksLoading,
      tracksDB,
      numberOfSongs,
      lastFmTopTags,
      selectedGenre,
      crawlerNbGenre,
      crawlerGenre,
      errorCrawlerNbGenre,
      errorCrawlerGenre
    } = this.state;

    const loadingComponent = <Loading />;

    return (
      <StyledAddSongsApp>
        <div className="container">
          {tracksLoading && loadingComponent}
          <div className="header">
            <Resource resourceKey="addSongsByNumber" />
          </div>
          <div className="addSongsByNumber">
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="numberOfGenres">
                  <Resource resourceKey="NumberOfNewGenres" />
                </label>
                <StyledInput
                  onChange={this.onChangeNbGenre}
                  type="number"
                  fullWidth={true}
                  id="numberOfGenres"
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="numberOfSongs">
                  <Resource resourceKey="NumberOfSongsPerGenre" />
                </label>
                <StyledInput
                  type="number"
                  onChange={this.onChangeNbSongsPerGenre}
                  fullWidth={true}
                  id="numberOfSongs"
                />
              </div>
            </div>
            <div className="buttonContainer">
              <StyledButton
                disabled={errorCrawlerNbGenre || !crawlerNbGenre}
                variant="primary"
                onClick={this.addSongsByNumberGenre}
              >
                <Resource resourceKey="add" />
              </StyledButton>
            </div>
          </div>
          <div className="header">
            <Resource resourceKey="addSongsByGenre" />
          </div>
          <div className="addSongsByNumber">
            <div className="row">
              <div className="col-sm-6 lastFmGenres">
                <ul>
                  {lastFmTopTags.map(genre => (
                    <li
                      className={classNames("clickable", {
                        selected: selectedGenre === genre
                      })}
                      key={genre}
                      onClick={this.selectGenre(genre)}
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-sm-6">
                {selectedGenre !== "" && (
                  <div className="row">
                    <div className="col-4 genre">{selectedGenre}</div>
                    <div className="col-8">
                      <label htmlFor="numberPerGenre">
                        <Resource resourceKey="numberForGenre" />
                      </label>
                      <StyledInput
                        onChange={this.onChangeNbSongsForGenre}
                        type="number"
                        fullWidth={true}
                        id="numberPerGenre"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="buttonContainer">
              <StyledButton
                disabled={errorCrawlerGenre || !crawlerGenre}
                variant="primary"
                onClick={this.addSongsForGenre}
              >
                <Resource resourceKey="add" />
              </StyledButton>
            </div>
          </div>
          <div className="header">
            <Resource resourceKey="songs" />
            <div className="tracksNumber">
              {numberOfSongs} <Resource resourceKey="songsInDatabase" />
            </div>
          </div>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <Resource resourceKey="genre" />
                  </th>
                  <th colSpan={2}>
                    <Resource resourceKey="album" />
                  </th>
                  <th>
                    <Resource resourceKey="name" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tracksDB.map(track => (
                  <tr key={track.id}>
                    <td>{track.id}</td>
                    <td className="genre">{track.genre}</td>
                    <td>
                      <img src={track.art} alt="album" />
                    </td>
                    <td>{track.title}</td>
                    <td>{track.album}</td>
                    <td onClick={this.deleteSong(track.id)}>
                      <img
                        className="deleteIcon clickable"
                        src={DeleteIcon}
                        alt="delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StyledAddSongsApp>
    );
  }
}

const StyledAddSongsApp = styled.div`
  background-color: ${lightGray};

  .selected {
    font-weight: bold;
    background-color: ${lightGray};
  }

  .genre {
    text-transform: uppercase;
    font-weight: bold;
  }

  .header {
    padding: 20px;
    font-size: 20px;
    font-weight: bold;
  }

  .buttonContainer {
    padding: 17px;
    width: 100%;
    text-align: right;
  }

  .addSongsByNumber {
    background-color: ${white};
    border-radius: 10px;
    padding: 20px;

    .row {
      margin: 0;
    }

    .lastFmGenres {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid ${gray};
      border-radius: 10px;

      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: ${gray};
        border-radius: 10px;
      }
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      text-transform: uppercase;

      li {
        padding: 6px;
      }
    }
  }

  .tracksNumber {
    font-size: 14px;
    float: right;
    font-weight: bold;
    padding: 16px;
  }

  .tableContainer {
    background-color: ${white};
    border-radius: 10px;
    width: 100%;

    table {
      width: 100%;

      th,
      td {
        padding: 15px;
      }

      th {
        position: sticky;
        top: 0;
        background-color: ${white};
        border-bottom: 1px solid ${gray};
      }

      .genre {
        text-transform: uppercase;
      }

      td {
        img {
          height: 30px;
          width: 30px;
        }

        .deleteIcon {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
`;
