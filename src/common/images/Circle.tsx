import React from "react";

type CircleProps = {
  color: string;
  marginBottom?: string;
};

export const Circle = (props: CircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    style={{ marginBottom: props.marginBottom }}
  >
    <g id="Blue.Ellipse" fill="#fff" stroke={props.color} strokeWidth="3">
      <circle cx="8" cy="8" r="8" stroke="none" />
      <circle cx="8" cy="8" r="6.5" fill="none" />
    </g>
  </svg>
);
