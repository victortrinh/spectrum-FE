import React from "react";
import styled from "styled-components";
import PlusLogo from "../../../common/images/plus.svg";
import MinusLogo from "../../../common/images/minus.svg";
import { CheckboxModel } from "../models/checkboxModel";
import { Resource } from "common/components/Resource";

type OwnProps = {
  checkboxes: CheckboxModel[];
};

type State = {
  showAll: boolean;
};

type Props = OwnProps;

export class CheckboxSelection extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      showAll: false
    };
  }

  onClickPositive = () => {
    this.setState({
      showAll: true
    });
  };

  onClickNegative = () => {
    this.setState({
      showAll: false
    });
  };

  render() {
    const { checkboxes } = this.props;
    const { showAll } = this.state;

    return (
      <StyledCheckboxSelection>
        {checkboxes.slice(0, 3).map(checkbox => (
          <div key={checkbox.id} className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={checkbox.value + checkbox.id}
            />
            <label
              className="custom-control-label"
              htmlFor={checkbox.value + checkbox.id}
            >
              {checkbox.value}
            </label>
          </div>
        ))}
        {showAll ? (
          <>
            {checkboxes.slice(3).map(checkbox => (
              <div key={checkbox.id} className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={checkbox.value + checkbox.id}
                />
                <label
                  className="custom-control-label"
                  htmlFor={checkbox.value + checkbox.id}
                >
                  {checkbox.value}
                </label>
              </div>
            ))}
            <span className="show" onClick={this.onClickNegative}>
              <input
                type="image"
                className="less"
                alt="Minus logo"
                src={MinusLogo}
                onClick={this.onClickNegative}
              />
              <Resource resourceKey="less" />
            </span>
          </>
        ) : (
          <span className="show" onClick={this.onClickPositive}>
            <input type="image" alt="Positive logo" src={PlusLogo} />
            <Resource resourceKey="more" />
          </span>
        )}
      </StyledCheckboxSelection>
    );
  }
}

const StyledCheckboxSelection = styled.div`
  label {
    padding-left: 5px !important;
  }

  .custom-checkbox {
    padding-bottom: 5px;
  }

  .show {
    margin-left: 25px;
    cursor: pointer;

    input {
      margin-right: 5px;
    }

    .less {
      padding: 4px 0;
    }
  }
`;
