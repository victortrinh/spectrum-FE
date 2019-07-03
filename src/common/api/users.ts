import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type User = {
  email: string;
  username: string;
  password: string;
};

export class UsersAPI {
  createUser(user: User) {
    return this.perform("post", "/api/user/register", user);
  }

  getUsers() {
    return this.perform("get", "/api/user/");
  }

  async perform(method: any, resource: any, data: User | null = null) {
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
