import MissingImage from "../../common/images/missingSong.png";

export type Track = {
  mbid: string;
  name: string;
  artist: string;
};

export class LastFmAPI {
  setTrackInfo = async (tracks: any[]) => {
    for (const track of tracks) {
      const trackInfoJson = await this.getTrackInfo({
        mbid: track.mbid,
        name: track.name,
        artist: track.artist
      });

      const trackInfo = trackInfoJson.track;

      if (trackInfo) {
        track.genre = trackInfo.toptags
          ? trackInfo.toptags.tag[0]
            ? trackInfo.toptags.tag[0].name
            : "No genre"
          : "No genre";
        track.album = trackInfo.album ? trackInfo.album.title : "";
        track.length = this.millisToMinutesAndSeconds(
          Number(trackInfo.duration)
        );
        track.url = trackInfo.url;
        track.imageSrc =
          !trackInfo.album || trackInfo.album.image[2]["#text"] === ""
            ? MissingImage
            : trackInfo.album.image[2]["#text"];
      } 
    }
  };

  millisToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  };

  getTrackInfo = async (track: Track) => {
    let responseTrackInfo;

    if (track.mbid !== "") {
      responseTrackInfo = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=a09702ee21fe630efc366adf3c546342&format=json&mbid=` +
          track.mbid
      );
    } else {
      responseTrackInfo = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=a09702ee21fe630efc366adf3c546342&artist=` +
          track.artist +
          `&track=` +
          track.name +
          `&format=json`
      );
    }

    return await responseTrackInfo.json();
  };

  getTracks = async (searchTerm: string, page: Number = 1) => {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?format=json&method=track.search&track=` +
        searchTerm +
        `&api_key=a09702ee21fe630efc366adf3c546342&limit=20&page=` +
        page +
        `&artist`
    );

    return await response.json();
  };
}
