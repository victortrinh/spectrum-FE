import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type CrawlerNbGenre = {
  nb_genres: number;
  nb_songs_per_genre: number;
};

export type CrawlerGenre = {
  genre: string;
  nb_songs: number;
};

export class CrawlerAPI {
  async crawlByNbGenre(crawlerNbGenre: CrawlerNbGenre) {
    return this.perform("post", "/api/crawler/", crawlerNbGenre);
  }

  async crawlByGenre(crawlerGenre: CrawlerGenre) {
    return this.perform("post", "/api/crawler/genre", crawlerGenre);
  }

  async perform(
    method: any,
    resource: any,
    data: CrawlerNbGenre | CrawlerGenre | null = null
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
