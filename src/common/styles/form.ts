import { css } from "styled-components";
import { lighten } from "polished";
import { lightGray, gray } from "./colors";

type FieldAlikeProps = {
  variant?: "pill" | "fill";
  fullWidth?: boolean;
  invalid?: boolean;
  borderLeft?: string;
};

export const fieldAlike = (props?: FieldAlikeProps) => css`
  padding: 0 10px;
  font-size: 14px;
  background-color: ${lightGray} !important;
  width: ${props && props.fullWidth && "100%"};
  border: 1px solid transparent;
  border-color: ${props && props.invalid ? "red" : lightGray} !important;
  height: 40px;
  line-height: 34px;
  border-radius: 4px;
  border-left: ${props && props.borderLeft};
  ${(props && (props.variant && props.variant)) === "pill" &&
    "border-radius: 99px;"};

  ::placeholder {
    color: ${gray};
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 2px 2px ${lighten(0.55, lightGray)};
    outline: none;
  }
`;
