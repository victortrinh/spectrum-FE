import styled, { css } from "styled-components";
import { darken } from "polished";
import { primaryColor, gray, white, black, lightGray } from "../styles/colors";

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
    color: ${black};
    border: 1px solid ${lightGray};
    background: ${lightGray};
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s linear;

    &:hover {
      background: ${darken(0.08, lightGray)};
      border: 1px solid ${darken(0.08, lightGray)};
    }

    &:disabled,
    &:disabled:hover {
      color: ${white};
      border-color: ${gray};
      background: ${gray};
      cursor: not-allowed;
    }

    ${props.variant &&
      props.variant === "primary" &&
      css`
        background: ${primaryColor};
        border-color: ${primaryColor};
        color: ${white};

        &:hover {
          background: ${darken(0.08, primaryColor)};
          border-color: ${darken(0.08, primaryColor)};
          color: ${white};
        }
      `};

    ${props.variant &&
      props.variant === "secondary" &&
      css`
        background: ${white};
        border: 1px solid ${primaryColor};
        color: ${primaryColor};

        &:hover {
          background: ${white};
          border: 1px solid ${darken(0.08, primaryColor)};
          color: ${darken(0.08, primaryColor)};
        }
      `};
  `};
`;

export const StyledLinkButton = StyledButton.withComponent("a");
