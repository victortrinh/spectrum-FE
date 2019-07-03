import React from "react";
import styled from "styled-components";
import { Resource } from "common/components/Resource";

export class NeedPermissionApp extends React.PureComponent {
  render() {
    return (
      <StyledNeedPermissionApp className="container">
        <Resource resourceKey="needPermission" />
      </StyledNeedPermissionApp>
    );
  }
}

const StyledNeedPermissionApp = styled.div`
  margin-top: 40px;
  font-size: 30px;
`;
