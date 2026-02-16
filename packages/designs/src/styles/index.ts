import { DefaultTypographyStyles, TypographyStyles } from './TypographyStyles';

export * from './TypographyStyles';

export type DesignElementStyle = TypographyStyles;
export type DesignElementStyleOption = keyof DesignElementStyle;

export const DefaultDesignElementStyle: DesignElementStyle = {
  ...DefaultTypographyStyles,
};
