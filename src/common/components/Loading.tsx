import * as React from "react";
import { Resource } from "./Resource";
import styled from "styled-components";
import { black } from 'common/styles/colors';

export class Loading extends React.PureComponent<any> {
  public render() {
    return (
      <StyledLoading id="loadingmessageDiv" className="loadingmessage">
        <div className="white-container">
          <div className="loading-container">
            <i className="fa fa-spinner fa-pulse" />
            <p>
              <Resource resourceKey="pageLoading" />
            </p>
          </div>
        </div>
      </StyledLoading>
    );
  }
}

const StyledLoading = styled.div`
  display: block;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1200;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);

  :before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    margin-right: -4px;
  }

  .white-container {
    margin: 0px;
    width: 90%;
    max-width: 300px;
    border-radius: 6px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    background-color: white;
    height: 300px;

    .loading-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%); /* IE 9 */
      -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
      -o-transform: translate(-50%, -50%); /* Opera */
      -moz-transform: translate(-50%, -50%); /* Firefox */
      width: 100%;
      color: ${black};

      .fa-spinner {
        display: block;
        width: 100%;
        margin-bottom: 20px;
        font-size: 64px !important;
      }
    }
  }
`;
