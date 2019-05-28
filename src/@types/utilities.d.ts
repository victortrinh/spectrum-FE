// source: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Without<T> = { [P in keyof T]?: never };

type OneOf<T, U> = (Without<T> & U) | (Without<U> & T);
