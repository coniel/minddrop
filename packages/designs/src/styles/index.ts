import { ContainerStyles, DefaultContainerStyles } from './ContainerStyles';
import { DefaultTypographyStyles, TypographyStyles } from './TypographyStyles';

export * from './TypographyStyles';
export * from './ContainerStyles';

export type DesignElementStyle = TypographyStyles & ContainerStyles;
export type DesignElementStyleOption = keyof DesignElementStyle;

export const DefaultDesignElementStyle: DesignElementStyle = {
  ...DefaultTypographyStyles,
  ...DefaultContainerStyles,
};
