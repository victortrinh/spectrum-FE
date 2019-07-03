import React from "react";
import styled from "styled-components";
import Formsy from "formsy-react";
import Logo from "../common/images/BlackLogo.svg";
import { StyledInput } from "../common/components/Form.styles";
import { Resource } from "../common/components/Resource";
import ValidatedInput from "common/components/ValidatedInput";
import { StyledButton } from "common/components/Button.styles";
import AppContext from "AppContext";
import { darkerGray, black } from "common/styles/colors";
import { Link, Redirect } from "react-router-dom";
import { AuthenticationAPI } from "common/api/authentication";

type OwnProps = {
  setLogIn: (loggedIn: boolean) => void;
  loggedIn: boolean;
};

type State = {
  valid: boolean;
  email: string;
  password: string;
  errorMessage: string;
};

type Props = OwnProps;

export class LoginApp extends React.PureComponent<Props, State> {
  authenticationAPI: AuthenticationAPI = new AuthenticationAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      valid: false,
      email: "",
      password: "",
      errorMessage: ""
    };
  }

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

  onSubmit = async () => {
    if (this.state.valid) {
      this.setState({
        errorMessage: ""
      });

      await this.authenticationAPI
        .login({
          email: this.state.email,
          password: this.state.password
        })
        .then(resp => {
          if (resp.isError) {
            this.setState({
              errorMessage: resp.data
            });
          } else {
            this.props.setLogIn(true);
          }
        });
    }
  };

  changeValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    const nameState = e.currentTarget.name;

    this.setState({
      [nameState]: name
    } as any);
  };

  render() {
    const { email, errorMessage } = this.state;
    const { loggedIn } = this.props;

    if (loggedIn) {
      return <Redirect to="/admin" />;
    }

    return (
      <StyledLoginApp className="container text-center">
        <div className="header">
          <img src={Logo} alt="logo" />
          <div className="logo">SPECTRUM</div>
        </div>
        <div className="subHead">
          <Resource resourceKey="welcomeBack" />
        </div>
        {errorMessage !== "" && (
          <div className="alert alert-danger col-xs-12 col-sm-12 col-md-6 offset-md-3">
            {errorMessage}
          </div>
        )}
        <Formsy
          className="col-xs-12 col-sm-12 col-md-6 offset-md-3"
          onSubmit={this.onSubmit}
          onValid={this.setValid}
          onInvalid={this.setInvalid}
        >
          <div className="inputGroup">
            <label htmlFor="email" className="w-100 text-left">
              <Resource resourceKey="email" />
            </label>
            <AppContext.Consumer>
              {context => (
                <ValidatedInput
                  onChange={this.changeValue}
                  name="email"
                  id="email"
                  value={email}
                  validations="isEmail"
                  validationError={context.getResource("mustBeEmail")}
                  fullWidth={true}
                  required
                />
              )}
            </AppContext.Consumer>
          </div>
          <div className="inputGroup">
            <label htmlFor="password" className="w-100 text-left">
              <Resource resourceKey="password" />
            </label>
            <StyledInput
              name="password"
              type="password"
              id="password"
              onChange={this.changeValue}
              fullWidth={true}
              required
            />
          </div>
          <div className="w-100 text-right forgetPassword">
            <Link to="register">
              <Resource resourceKey="forgetPassword" />
            </Link>
          </div>
          <StyledButton
            type="submit"
            variant="primary"
            style={{ width: "150px" }}
          >
            <Resource resourceKey="loginButton" />
          </StyledButton>
        </Formsy>
      </StyledLoginApp>
    );
  }
}

const StyledLoginApp = styled.div`
  .inputGroup {
    margin-top: 12px;
  }

  button {
    margin-top: 40px;
  }

  .alert {
    margin-top: 20px;
  }

  .header {
    margin-top: 40px;
  }

  .subHead {
    margin-top: 30px;
    font-size: 18px;
    color: ${darkerGray};
  }

  form {
    margin-top: 30px;
  }

  a {
    color: ${black};
  }

  .forgetPassword {
    margin-top: 20px;
  }

  .logo {
    font-size: 20px;
    margin-top: 20px;
    font-weight: 500;
  }
`;
