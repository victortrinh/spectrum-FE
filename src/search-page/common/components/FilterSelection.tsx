import React from "react";
import styled from "styled-components";
import PlusLogo from "../../../common/images/plus.svg";
import MinusLogo from "../../../common/images/minus.svg";
import { Resource } from "common/components/Resource";
import { gray } from "common/styles/colors";

type OwnProps = {
  headerResourceKey: string;
  showFilterAtStart: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
  backgroundHeader?: boolean;
  id?: string;
};

type State = {
  showFilter: boolean;
};

type Props = OwnProps;

export class FilterSelection extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      showFilter: this.props.showFilterAtStart
    };
  }

  onClickPositive = () => {
    this.setState({
      showFilter: true
    });
  };

  onClickNegative = () => {
    this.setState({
      showFilter: false
    });
  };

  render() {
    const {
      headerResourceKey,
      borderBottom,
      borderTop,
      children,
      backgroundHeader,
      id
    } = this.props;
    const { showFilter } = this.state;

    return (
      <StyledFilterSelection
        backgroundHeader={backgroundHeader}
        borderTop={borderTop}
        borderBottom={borderBottom}
      >
        <div
          className="headerSection clickable"
          onClick={showFilter ? this.onClickNegative : this.onClickPositive}
        >
          <Resource resourceKey={headerResourceKey} />
          {showFilter ? (
            <input
              type="image"
              className="negativeSign"
              alt="Negative logo"
              src={MinusLogo}
            />
          ) : (
            <input
              type="image"
              className="positiveSign"
              alt="Positive logo"
              src={PlusLogo}
            />
          )}
        </div>
        {showFilter && (
          <div id={id} className="filterSection">
            {children}
          </div>
        )}
      </StyledFilterSelection>
    );
  }
}

type StyledFilterSelectionProps = {
  borderBottom?: boolean;
  borderTop?: boolean;
  backgroundHeader?: boolean;
};

const StyledFilterSelection = styled.div<StyledFilterSelectionProps>`
  padding-top: 15px;
  padding-bottom: 15px;
  border-top: ${props => (props.borderTop ? "1px solid" + gray : null)};
  border-bottom: ${props => (props.borderBottom ? "1px solid" + gray : null)};

  .filterSection {
    margin-top: 10px;
  }

  .headerSection {
    font-size: 14px;
    font-weight: 600;
    background-color: ${props => (props.backgroundHeader ? gray : null)};
    padding: ${props => (props.backgroundHeader ? "8px 10px" : null)};
    border-radius: ${props => (props.backgroundHeader ? "3px" : null)};

    .positiveSign {
      float: right;
      padding: 5px 0;
      cursor: pointer;
    }

    .negativeSign {
      float: right;
      padding: 11px 0;
      cursor: pointer;
    }
  }
`;
