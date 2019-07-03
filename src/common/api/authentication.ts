import axios from "axios";
import { env } from "./env";

const client = axios.create({
  baseURL: env.pythonBaseUrl
});

export type Authentication = {
  email: string;
  password: string;
};

export class AuthenticationAPI {
  login(auth: Authentication) {
    return this.perform("post", "/api/auth/login", auth);
  }

  logout() {
    localStorage.setItem("loggedIn", "false");
    localStorage.setItem("emailLoggedIn", "");
    return this.perform("post", "/api/auth/logout");
  }

  async perform(
    method: any,
    resource: any,
    data: Authentication | null = null
  ) {
    const auth = data;

    return client({
      method,
      url: resource,
      data
    }).then(
      resp => {
        if (resp.data && auth) {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("emailLoggedIn", (auth as Authentication).email);
        }

        return { isError: false, data: [] };
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
