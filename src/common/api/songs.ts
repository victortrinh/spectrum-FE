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
  image_src: string;
  album: string;
  primitives: any;
  preview_url: string;
};

export class SongsAPI {
  async getSongs() {
    return this.perform("get", "/api/song/all");
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
          data: error.response ? error.response.data.message : "Error with back-end"
        };
      }
    );
  }
}