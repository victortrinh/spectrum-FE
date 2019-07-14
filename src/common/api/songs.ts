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

export class SongsAPI {
  async getSongs() {
    return this.perform("get", "/api/song/all");
  }

  async getSong(trackId: string) {
    return this.perform("get", "/api/song/" + trackId);
  }

  async perform(method: any, resource: any, data: Song | null = null) {
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
