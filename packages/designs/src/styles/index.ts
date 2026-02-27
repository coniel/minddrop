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

export type TextElementStyle = TypographyStyles;
export type ContainerElementStyle = ContainerStyles &
  Pick<TypographyStyles, 'font-family' | 'font-weight' | 'color' | 'opacity'>;
export type ImageElementStyle = Pick<
  ContainerStyles,
  'borderStyle' | 'borderColor' | 'borderWidth' | 'borderRadius'
> &
  Pick<TypographyStyles, 'opacity'>;

export const DefaultTextElementStyle: TextElementStyle = {
  ...DefaultTypographyStyles,
};

export const DefaultContainerElementStyle: ContainerElementStyle = {
  ...DefaultContainerStyles,
  'font-family': DefaultTypographyStyles['font-family'],
  'font-weight': DefaultTypographyStyles['font-weight'],
  color: DefaultTypographyStyles.color,
  opacity: DefaultTypographyStyles.opacity,
};

export const DefaultImageElementStyle: ImageElementStyle = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderWidth: DefaultContainerStyles.borderWidth,
  borderRadius: DefaultContainerStyles.borderRadius,
  opacity: DefaultTypographyStyles.opacity,
};
