import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Genre = {
  id: number;
  selected: boolean;
};

export class GenresAPI {
  async updateGenre(genre: Genre) {
    return await this.perform("put", "/api/genre/update", genre);
  }

  async getGenres() {
    return this.perform("get", "/api/genre/all");
  }

  async getStats() {
    return this.perform("get", "/api/genre/stats");
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
