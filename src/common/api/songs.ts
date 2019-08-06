import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Song = {
  id: number;
  artist: string;
  genre: string;
  title: string;
  duration: string;
  art: string;
  album: string;
  primitives: any;
  sound: string | null;
};

export type DeleteSong = {
  id: number;
};

export class SongsAPI {
  async getSongs() {
    return this.perform("get", "/api/song/all");
  }

  async getSong(trackId: string) {
    return this.perform("get", "/api/song/" + trackId);
  }

  async deleteSong(deleteSong: DeleteSong) {
    this.perform("delete", "/api/song/delete", deleteSong);
  }

  async perform(
    method: any,
    resource: any,
    data: Song | DeleteSong | null = null
  ) {
    return client({
      method,
      url: resource,
      data
    }).then(
      resp => {
        return { isError: false, data: resp.data };
      },
      error => {
        return {
          isError: true,
          data: error.response
            ? error.response.data.message
            : "Error with back-end"
        };
      }
    );
  }
}
