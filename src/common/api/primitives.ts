import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Primitive = {
  id: number;
  selected: boolean;
};

export class PrimitivesAPI {
  async updatePrimitive(primitive: Primitive) {
    return this.perform("put", "/api/primitive/update", primitive);
  }

  async getPrimitives() {
    return this.perform("get", "/api/primitive/all");
  }

  async perform(method: any, resource: any, data: Primitive | null = null) {
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
