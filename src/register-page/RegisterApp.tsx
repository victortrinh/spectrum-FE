import React from "react";
import styled from "styled-components";
import { StyledInput } from "../common/components/Form.styles";
import { Resource } from "../common/components/Resource";
import { User, UsersAPI } from "../common/api/users";
import { StyledButton } from "common/components/Button.styles";

type State = {
  user: User;
};

export class RegisterApp extends React.PureComponent<{}, State> {
  usersApi: UsersAPI = new UsersAPI();

  constructor(props: any) {
    super(props);

    const initialUser: User = {
      email: "",
      username: "",
      password: ""
    };

    this.state = {
      user: initialUser
    };
  }

  createUser = () => {
    if (this.state.user !== undefined) {
      this.usersApi.createUser(this.state.user).then(data => 
        console.log(data));
    }
  };

  onChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [name]: value
      }
    }));
  };

  render() {
    return (
      <StyledRegisterApp className="container" onSubmit={this.createUser}>
        <div className="col-xs-12 col-sm-6 offset-sm-3">
          <div className="header">
            <Resource resourceKey="register" />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">
              <Resource resourceKey="email" />
            </label>
            <StyledInput
              type="email"
              id="email"
              name="email"
              onChange={this.onChange}
              fullWidth={true}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="username">
              <Resource resourceKey="username" />
            </label>
            <StyledInput
              id="username"
              name="username"
              onChange={this.onChange}
              fullWidth={true}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">
              <Resource resourceKey="password" />
            </label>
            <StyledInput
              type="password"
              id="password"
              name="password"
              onChange={this.onChange}
              fullWidth={true}
            />
          </div>
          <div className="inputGroup">
            <StyledButton onClick={this.createUser}>
              <Resource resourceKey="registerButton" />
            </StyledButton>
          </div>
        </div>
      </StyledRegisterApp>
    );
  }
}

const StyledRegisterApp = styled.form`
  .inputGroup {
    margin-top: 12px;
  }
`;
