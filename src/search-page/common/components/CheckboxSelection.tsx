import React from "react";
import styled from "styled-components";
import PlusLogo from "../../../common/images/plus.svg";
import MinusLogo from "../../../common/images/minus.svg";
import { CheckboxModel } from "../models/checkboxModel";
import { Resource } from "common/components/Resource";

type OwnProps = {
  checkboxes: CheckboxModel[];
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  marginLeft?: boolean;
  select?: boolean;
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
    const { checkboxes, marginLeft, select, onChange } = this.props;
    const { showAll } = this.state;

    return (
      <StyledCheckboxSelection marginLeft={marginLeft}>
        {checkboxes.slice(0, 3).map(checkbox => (
          <div key={checkbox.id} className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={checkbox.id.toString()}
              defaultChecked={select && checkbox.is_selected}
              onChange={onChange}
            />
            <label
              className="custom-control-label"
              htmlFor={checkbox.id.toString()}
            >
              {checkbox.name}
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
                  id={checkbox.id.toString()}
                  defaultChecked={select && checkbox.is_selected}
                  onChange={onChange}
                />
                <label
                  className="custom-control-label"
                  htmlFor={checkbox.id.toString()}
                >
                  {checkbox.name}
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
          <>
            {checkboxes.length > 3 && (
              <span className="show" onClick={this.onClickPositive}>
                <input type="image" alt="Positive logo" src={PlusLogo} />
                <Resource resourceKey="more" />
              </span>
            )}
          </>
        )}
      </StyledCheckboxSelection>
    );
  }
}

type StyledCheckboxSelectionProps = {
  marginLeft?: boolean;
};

const StyledCheckboxSelection = styled.div<StyledCheckboxSelectionProps>`
  label {
    padding-left: 5px !important;
  }

  .custom-checkbox {
    padding-bottom: 5px;
    margin-left: ${props => (props.marginLeft ? "10px" : null)};
  }

  .show {
    margin-left: ${props => (props.marginLeft ? "35px" : "25px")};
    cursor: pointer;

    input {
      margin-right: 5px;
    }

    .less {
      padding: 4px 0;
    }
  }
`;
