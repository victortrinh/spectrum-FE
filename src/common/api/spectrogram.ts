import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl,
  responseType: 'arraybuffer'
});

export type Export = {
  song_id: number;
};

export class SpectrogramAPI {
  async getSpectrogram(data: Export) {
    return this.perform("post", "/api/export/spectrogram", data);
  }

  async perform(method: any, resource: any, data: Export | null = null) {
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
