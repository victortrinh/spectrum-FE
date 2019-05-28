import React from "react";
import styled from "styled-components";
import { StyledInput } from "../common/components/Form.styles";
import { Resource } from "../common/components/Resource";
import { User, UsersAPI } from "../common/api/users";

type State = {
  users: User[];
};

export class LoginApp extends React.PureComponent<{}, State> {
  usersApi: UsersAPI = new UsersAPI();

  constructor(props: any) {
    super(props);
    this.state = {
      users: []
    };
  }

  async componentDidMount() {
    this.usersApi
      .getUsers()
      .then(data =>
        this.setState({ ...this.state, users: data["data"] as User[] })
      );
  }

  render() {
    const { users } = this.state;
    return (
      <StyledLoginApp className="container">
        <div className="col-xs-12 col-sm-6 offset-sm-3">
          <div className="header">
            <Resource resourceKey="login" />
          </div>
          <div className="inputGroup">
            <label htmlFor="username">
              <Resource resourceKey="username" />
            </label>
            <StyledInput id="username" fullWidth={true} />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">
              <Resource resourceKey="password" />
            </label>
            <StyledInput type="password" id="password" fullWidth={true} />
          </div>
        </div>
        {users.length > 0 && (
          <div>
            Current Users in DB
            {users.map(user => (
              <div key={user.email} className="col-sm-6">
                <strong>Username:</strong> {user.username}{" "}
                <strong>Email:</strong> {user.email}
              </div>
            ))}
          </div>
        )}
      </StyledLoginApp>
    );
  }
}

const StyledLoginApp = styled.form`
  .inputGroup {
    margin-top: 12px;
  }
`;
