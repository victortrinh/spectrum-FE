export type BreakpointNames = "XS" | "SM" | "MD" | "LG" | "XL";

export const breakpoints : any = {
  XS_MAX: 575.98,
  SM_MIN: 576,
  SM_MAX: 767.98,
  MD_MIN: 768,
  MD_MAX: 991.98,
  LG_MIN: 992,
  LG_MAX: 1199.98,
  XL_MIN: 1200
};

type BreakpointRange = Partial<{
  from: BreakpointNames;
  to: BreakpointNames;
}>;

type BreakpointOne = {
  at: BreakpointNames;
};

export type BreakpointProps = OneOf<BreakpointRange, BreakpointOne>;

export const getBreakpointOffset = (props: BreakpointProps): { min: number; max: number } => {
  if (props.at) {
    return {
      min: breakpoints[`${props.at}_MIN`] || null,
      max: breakpoints[`${props.at}_MAX`] || null
    };
  } else {
    return {
      min: (props.from && breakpoints[`${props.from}_MIN`]) || null,
      max: (props.to && breakpoints[`${props.to}_MAX`]) || null
    };
  }
};