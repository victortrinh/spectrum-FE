import styled, { css } from "styled-components";
import { primaryColor, primaryDisabledColor } from "../styles/colors";

type Props = {
  variant?: "primary" | "secondary";
  size?: "small" | "normal" | "large";
  fullWidth?: boolean;
  letterSpacing?: string;
};

export const StyledButton = styled.button<Props>`
  ${props => css`
    display: inline-block;
    width: ${props.fullWidth && "100%"};
    letter-spacing: ${props.letterSpacing};
    height: 40px;
    padding: 0 25px;
    color: #333;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s linear;

    &:hover {
      color: #333;
      background: #f3f3f3;
    }

    &:disabled,
    &:disabled:hover {
      color: #b2b2b2;
      background: #dddddd;
      cursor: not-allowed;
    }

    ${props.variant &&
      props.variant === "primary" &&
      css`
        background: ${primaryColor};
        border-color: ${primaryColor};
        color: #fff;

        &:hover {
          background: #fff;
          border: 1px solid ${primaryColor};
          color: ${primaryColor};
        }

        &:disabled,
        &:disabled:hover {
          background: ${primaryDisabledColor};
          border-color: ${primaryDisabledColor};
          color: #fff;
          cursor: not-allowed;
        }
      `};

    ${props.variant &&
      props.variant === "secondary" &&
      css`
        background: #fff;
        border: 1px solid ${primaryColor};
        color: ${primaryColor};

        &:hover {
          background: ${primaryColor};
          border-color: ${primaryColor};
          color: #fff;
        }

        &:disabled,
        &:disabled:hover {
          background: #fff;
          border-color: ${primaryDisabledColor};
          color: ${primaryDisabledColor};
          cursor: not-allowed;
        }
      `};
  `};
`;

export const StyledLinkButton = StyledButton.withComponent("a");
