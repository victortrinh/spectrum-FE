import { withFormsy } from "formsy-react";
import React from "react";
import { StyledInput } from "./Form.styles";

type OwnProps = {
  value: string;
  getErrorMessage: any;
  getValue: any;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
};

type Props = OwnProps;

class ValidatedInput extends React.Component<Props> {
  render() {
    const errorMessage = this.props.getErrorMessage();

    return (
      <>
        <StyledInput value={this.props.value} {...this.props} />
        {errorMessage && <span className="error">{errorMessage}</span>}
      </>
    );
  }
}

export default withFormsy(ValidatedInput);
