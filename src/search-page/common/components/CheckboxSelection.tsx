import React from "react";
import styled from "styled-components";
import PlusLogo from "../../../common/images/plus.svg";
import MinusLogo from "../../../common/images/minus.svg";
import { CheckboxModel } from "../models/checkboxModel";
import { Resource } from "common/components/Resource";
import { StyledInput } from "common/components/Form.styles";
import { primaryColor } from "common/styles/colors";

type OwnProps = {
  checkboxes: CheckboxModel[];
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  marginLeft?: boolean;
  select?: boolean;
  selectAll?: boolean;
  filterable?: boolean;
  placeholderForFilter?: string;
  showAllAtStart?: boolean;
};

type State = {
  showAll: boolean;
  filteredCheckboxes: CheckboxModel[];
};

type Props = OwnProps;

export class CheckboxSelection extends React.PureComponent<Props, State> {
  private checkboxSelection = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      showAll: false,
      filteredCheckboxes: []
    };
  }

  componentDidMount() {
    if (!this.props.select) {
      this.selectAll();
    }
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

  filter = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    this.setState(prevState => ({
      ...prevState,
      filteredCheckboxes: this.props.checkboxes.filter(x =>
        x.name.includes(value)
      )
    }));
  };

  selectAll = () => {
    if (this.checkboxSelection.current) {
      this.checkboxSelection.current
        .querySelectorAll<HTMLInputElement>("input[type='checkbox']")
        .forEach(x => x.setAttribute("checked", ""));
    }
  };

  unSelectAll = () => {
    if (this.checkboxSelection.current) {
      this.checkboxSelection.current
        .querySelectorAll<HTMLInputElement>("input[type='checkbox']")
        .forEach(x => x.removeAttribute("checked"));
    }
  };

  render() {
    const {
      marginLeft,
      select,
      onChange,
      selectAll,
      filterable,
      checkboxes,
      placeholderForFilter,
      showAllAtStart
    } = this.props;
    const { showAll, filteredCheckboxes } = this.state;

    const currentCheckboxes =
      filteredCheckboxes.length === 0 ? checkboxes : filteredCheckboxes;

    return (
      <StyledCheckboxSelection
        marginLeft={marginLeft}
        ref={this.checkboxSelection}
      >
        {selectAll && (
          <div className="selects">
            <div className="clickable float-left" onClick={this.selectAll}>
              <Resource resourceKey="selectAll" />
            </div>
            <div className="clickable float-right" onClick={this.unSelectAll}>
              <Resource resourceKey="deselectAll" />
            </div>
          </div>
        )}
        {filterable && (
          <StyledInput
            className="filter"
            placeholder={placeholderForFilter}
            fullWidth={true}
            onChange={this.filter}
          />
        )}
        {currentCheckboxes.slice(0, 3).map(checkbox => (
          <div key={checkbox.id} className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={checkbox.id.toString()}
              defaultChecked={select ? checkbox.is_selected : undefined}
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
        {showAll || showAllAtStart ? (
          <>
            {currentCheckboxes.slice(3).map(checkbox => (
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
            {!showAllAtStart && (
              <span className="show clickable" onClick={this.onClickNegative}>
                <input
                  type="image"
                  className="less"
                  alt="Minus logo"
                  src={MinusLogo}
                  onClick={this.onClickNegative}
                />
                <Resource resourceKey="less" />
              </span>
            )}
          </>
        ) : (
          <>
            {checkboxes.length > 3 && !showAllAtStart && (
              <span className="show clickable" onClick={this.onClickPositive}>
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

  .filter {
    margin-bottom: 10px;
  }

  .selects {
    height: 30px;
    font-weight: bold;
    color: ${primaryColor};
  }

  .custom-control-label {
    text-transform: uppercase;
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
