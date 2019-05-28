import React from "react";
import styled from "styled-components";
import { lightGray } from "common/styles/colors";
import { Resource } from "common/components/Resource";
import { StyledButton } from "common/components/Button.styles";
import { Redirect } from "react-router";

type State = {
  createUser: boolean;
};

export class AdminApp extends React.PureComponent<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      createUser: false
    };
  }

  createUser = () => {
    this.setState({
      createUser: true
    });
  };

  render() {
    const { createUser } = this.state;

    if (createUser) {
      return <Redirect to="/createUser" />;
    }

    return (
      <StyledAdminApp>
        <div className="container">
          <div className="header">
            <span className="title"><Resource resourceKey="adminPage" /></span>
            <StyledButton
              className="float-right"
              onClick={this.createUser}
              variant="secondary"
            >
              <Resource resourceKey="createUser" />
            </StyledButton>
          </div>
        </div>
      </StyledAdminApp>
    );
  }
}

const StyledAdminApp = styled.div`
  min-height: 100vh;
  background-color: ${lightGray};

  .header {
    padding-top: 30px;
  }

  .title {
    font-size: 26px;
    font-weight: 500;
  }
`;
