import React from "react";
import styled from "styled-components";
import Formsy from "formsy-react";
import { Resource } from "../common/components/Resource";
import { User, UsersAPI } from "../common/api/users";
import { lightGray, white } from "common/styles/colors";
import AppContext from "AppContext";
import ValidatedInput from "common/components/ValidatedInput";
import { StyledButton } from "common/components/Button.styles";
import { lighten } from "polished";

type State = {
  user: User;
  valid: boolean;
  errorMessage: string;
  users: User[];
};

export class CreateUserApp extends React.PureComponent<{}, State> {
  usersApi: UsersAPI = new UsersAPI();

  constructor(props: any) {
    super(props);

    const initialUser: User = {
      email: "",
      username: "",
      password: ""
    };

    this.state = {
      user: initialUser,
      valid: false,
      errorMessage: "",
      users: []
    };
  }

  async componentDidMount() {
    await this.getUsers();
  }

  getUsers = async () => {
    await this.usersApi.getUsers().then(resp => {
      if (resp.isError) {
        this.setState({
          errorMessage: resp.data
        });
      } else {
        this.setState({
          users: resp.data.data as User[]
        });
      }
    });
  };

  changeValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const nameState = e.currentTarget.name;

    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [nameState]: value
      }
    }));
  };

  setValid = () => {
    this.setState({
      valid: true
    });
  };

  setInvalid = () => {
    this.setState({
      valid: false
    });
  };

  createUser = () => {
    if (this.state.valid) {
      this.setState({
        errorMessage: ""
      });

      this.usersApi.createUser(this.state.user).then(resp => {
        if (resp.isError) {
          this.setState({
            errorMessage: resp.data
          });
        } else {
          this.getUsers();

          const emptyUser: User = {
            email: "",
            username: "",
            password: ""
          };

          this.setState({
            user: emptyUser
          });
        }
      });
    }
  };

  render() {
    const { user, users, errorMessage } = this.state;

    return (
      <StyledCreateUserApp>
        <div className="container">
          <div className="title">
            <Resource resourceKey="createUser" />
          </div>
          {errorMessage !== "" && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="createUserContainer">
            <Formsy
              onSubmit={this.createUser}
              onValid={this.setValid}
              onInvalid={this.setInvalid}
            >
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-3">
                  <div className="inputGroup">
                    <label htmlFor="username">
                      <Resource resourceKey="username" />
                    </label>
                    <AppContext.Consumer>
                      {context => (
                        <ValidatedInput
                          onChange={this.changeValue}
                          name="username"
                          id="username"
                          value={user.username}
                          validations={{
                            isAlphanumeric: true,
                            minLength: 6
                          }}
                          validationErrors={{
                            isAlphanumeric: context.getResource("alphanumeric"),
                            minLength: context.getResource("sixCharacters")
                          }}
                          fullWidth={true}
                          required
                        />
                      )}
                    </AppContext.Consumer>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-4">
                  <div className="inputGroup">
                    <label htmlFor="email">
                      <Resource resourceKey="email" />
                    </label>
                    <AppContext.Consumer>
                      {context => (
                        <ValidatedInput
                          onChange={this.changeValue}
                          name="email"
                          id="email"
                          value={user.email}
                          validations="isEmail"
                          validationError={context.getResource("mustBeEmail")}
                          fullWidth={true}
                          required
                        />
                      )}
                    </AppContext.Consumer>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3">
                  <div className="inputGroup">
                    <label htmlFor="password">
                      <Resource resourceKey="password" />
                    </label>
                    <AppContext.Consumer>
                      {context => (
                        <ValidatedInput
                          onChange={this.changeValue}
                          type="password"
                          name="password"
                          id="password"
                          value={user.password}
                          validations={{
                            minLength: 8
                          }}
                          validationErrors={{
                            minLength: context.getResource("eightCharacters")
                          }}
                          fullWidth={true}
                          required
                        />
                      )}
                    </AppContext.Consumer>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-2">
                  <StyledButton
                    className="createButton"
                    type="submit"
                    fullWidth={true}
                    variant="secondary"
                  >
                    <Resource resourceKey="create" />
                  </StyledButton>
                </div>
              </div>
            </Formsy>
          </div>
          <div className="title">
            <Resource resourceKey="users" />
          </div>
          <div className="usersContainer">
            {users.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>
                      <Resource resourceKey="username" />
                    </th>
                    <th>
                      <Resource resourceKey="email" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.email}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No Users</div>
            )}
          </div>
        </div>
      </StyledCreateUserApp>
    );
  }
}

const StyledCreateUserApp = styled.div`
  background-color: ${lightGray};
  min-height: 100vh;

  .title {
    padding-top: 30px;
    font-size: 26px;
    font-weight: 500;
  }

  .createUserContainer {
    margin-top: 20px;
    padding: 20px;
    background-color: ${white};
    border-radius: 3px;

    .createButton {
      margin-top: 27px;
    }

    @media only screen and (max-width: 767px) {
      .inputGroup {
        margin-top: 10px;
      }
    }
  }

  .usersContainer {
    margin-top: 20px;
    padding: 20px;
    background-color: ${white};
    border-radius: 3px;

    table {
      box-shadow: 0 0 2px 2px ${lighten(0.55, lightGray)};
      width: 100%;
      border: 1px solid ${lightGray};
    }

    td,
    th {
      padding: 20px;
    }

    th {
      background-color: ${lightGray};
    }

    td {
      border-bottom: 1px solid ${lightGray};
    }
  }
`;
