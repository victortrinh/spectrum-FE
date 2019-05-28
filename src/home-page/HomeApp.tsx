import React from "react";
import styled from "styled-components";

export class HomeApp extends React.PureComponent {
  render() {
    return (
      <StyledHomeApp className="container">
        <div className="header">Home</div>
      </StyledHomeApp>
    );
  }
}

const StyledHomeApp = styled.div``;
