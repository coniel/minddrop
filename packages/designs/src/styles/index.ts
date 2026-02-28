import { ContainerStyles, DefaultContainerStyles } from './ContainerStyles';
import { DefaultTypographyStyles, TypographyStyles } from './TypographyStyles';

export * from './TypographyStyles';
export * from './ContainerStyles';

export type DesignElementStyle = TypographyStyles &
  ContainerStyles & {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    widthUnit: SizeUnit;
    maxWidthUnit: SizeUnit;
    objectFit: ObjectFit;
    round: boolean;
  };
export type DesignElementStyleOption = keyof DesignElementStyle;

export const DefaultDesignElementStyle: DesignElementStyle = {
  ...DefaultTypographyStyles,
  ...DefaultContainerStyles,
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
  objectFit: 'cover',
  round: false,
};

export type TextElementStyle = TypographyStyles;
export type ContainerElementStyle = ContainerStyles &
  Pick<TypographyStyles, 'font-family' | 'font-weight' | 'color' | 'opacity'>;
export type ObjectFit = 'cover' | 'contain' | 'fill';
export type SizeUnit = 'px' | '%';

export interface ImageElementStyle
  extends Pick<
      ContainerStyles,
      | 'borderStyle'
      | 'borderColor'
      | 'borderWidth'
      | 'borderRadiusTopLeft'
      | 'borderRadiusTopRight'
      | 'borderRadiusBottomRight'
      | 'borderRadiusBottomLeft'
    >,
    Pick<TypographyStyles, 'opacity'> {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  objectFit: ObjectFit;
  round: boolean;
  widthUnit: SizeUnit;
  maxWidthUnit: SizeUnit;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

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
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  opacity: DefaultTypographyStyles.opacity,
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  objectFit: 'cover',
  round: false,
  widthUnit: '%',
  maxWidthUnit: '%',
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};
