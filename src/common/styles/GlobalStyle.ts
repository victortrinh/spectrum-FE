import { createGlobalStyle } from "styled-components";
import { fontSansSerif } from "./fonts";

export const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
    font-family: sans-serif;
  }

  body {
    font-family: ${fontSansSerif};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #333;
    text-align: left;

    &.noscroll {
      overflow: hidden !important;
    }
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="date"]::-webkit-inner-spin-button {
    display: none;
  }

  .hidden {
    display: none !important;
  }

  .header {
    font-size: 1.75rem;
    padding-top: 20px;
    padding-bottom: 10px;
  }

  .logo {
    font-size: 1rem;
    margin-left: 15px;
    letter-spacing: 10px;
  }
`;
