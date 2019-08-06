import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Export = {
  song_ids: number[];
  primitive_ids: number[];
};

export type ExportSuperPrimitive = {
  song_ids: number[];
  primitive_id: number;
};

export class ExportCsvAPI {
  async getCsv(data: Export) {
    return this.perform("post", "/api/export/primitive", data);
  }

  async getSuperPrimitiveCsv(data: ExportSuperPrimitive) {
    return this.perform("post", "/api/export/super_primitive", data);
  }

  async perform(
    method: any,
    resource: any,
    data: Export | ExportSuperPrimitive | null = null
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
