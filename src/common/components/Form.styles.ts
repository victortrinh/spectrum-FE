import styled from "styled-components";
import { fieldAlike } from "../styles/form";

type InputProps = {
  variant?: "pill" | "fill";
  fullWidth?: boolean;
  invalid?: boolean;
  borderLeft?: string;
};

type SelectProps = InputProps;

type TextareaProps = {
  variant?: "fill";
  fullWidth?: boolean;
};

export const StyledFormLabelGroup = styled.div`
  margin-bottom: 15px;

  label {
    margin: 0 0 5px;
    font-size: 13px;
    font-weight: 600;
    color: #777;
  }

  input,
  select,
  textarea {
    width: 100%;
  }
`;

export const StyledSelect = styled.select<SelectProps>`
  ${props => fieldAlike(props)};
`;

export const StyledInput = styled.input<InputProps>`
  ${props => fieldAlike(props)};
`;

export const StyledTextarea = styled.textarea<TextareaProps>`
  ${props => fieldAlike(props)};
  line-height: 1.1em;
`;