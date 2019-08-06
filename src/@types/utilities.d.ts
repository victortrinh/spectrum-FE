// source: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Without<T> = { [P in keyof T]?: never };

type OneOf<T, U> = (Without<T> & U) | (Without<U> & T);

declare module "formsy-react";
declare module "react-minimal-pie-chart";
declare module "react-audio-player";
declare module "react-image-file";
declare module "classnames";
