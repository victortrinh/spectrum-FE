import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Genre = {
  id: number;
  is_selected: boolean;
};

export class GenresAPI {
  updateGenre(genre: Genre) {
    return this.perform("put", "/api/update/genre", genre);
  }

  async getGenres() {
    return this.perform("get", "/api/genres");
  }

  async getStats() {
    return this.perform("get", "/api/stats");
  }

  async perform(method: any, resource: any, data: Genre | null = null) {
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
