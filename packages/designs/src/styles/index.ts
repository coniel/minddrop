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
    size: number;
    containerSize: number;
    containerBackgroundColor: string;
    containerBorderRadius: number;
    containerRound: boolean;
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
  size: 24,
  containerSize: 0,
  containerBackgroundColor: 'transparent',
  containerBorderRadius: 0,
  containerRound: false,
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
      | 'borderTopWidth'
      | 'borderRightWidth'
      | 'borderBottomWidth'
      | 'borderLeftWidth'
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

export interface BadgesElementStyle extends TypographyStyles {
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  borderStyle: ContainerStyles['borderStyle'];
  borderTopWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomRight: number;
  borderRadiusBottomLeft: number;
  round: boolean;
}

export const DefaultBadgesElementStyle: BadgesElementStyle = {
  ...DefaultTypographyStyles,
  'font-size': 0.75,
  paddingTop: 0.3125,
  paddingRight: 0.5,
  paddingBottom: 0.3125,
  paddingLeft: 0.5,
  borderStyle: DefaultContainerStyles.borderStyle,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
  borderRadiusTopLeft: 4,
  borderRadiusTopRight: 4,
  borderRadiusBottomRight: 4,
  borderRadiusBottomLeft: 4,
  round: false,
};

export const DefaultContainerElementStyle: ContainerElementStyle = {
  ...DefaultContainerStyles,
  'font-family': DefaultTypographyStyles['font-family'],
  'font-weight': DefaultTypographyStyles['font-weight'],
  color: DefaultTypographyStyles.color,
  opacity: DefaultTypographyStyles.opacity,
};

export interface IconElementStyle {
  size: number;
  color: string;
  opacity: number;
  containerSize: number;
  containerBackgroundColor: string;
  containerBorderRadius: number;
  containerRound: boolean;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

export const DefaultIconElementStyle: IconElementStyle = {
  size: 24,
  color: 'default',
  opacity: 1,
  containerSize: 0,
  containerBackgroundColor: 'transparent',
  containerBorderRadius: 0,
  containerRound: false,
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};

export interface WebviewElementStyle
  extends Pick<
      ContainerStyles,
      | 'borderStyle'
      | 'borderColor'
      | 'borderTopWidth'
      | 'borderRightWidth'
      | 'borderBottomWidth'
      | 'borderLeftWidth'
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
  widthUnit: SizeUnit;
  maxWidthUnit: SizeUnit;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

export const DefaultWebviewElementStyle: WebviewElementStyle = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  opacity: DefaultTypographyStyles.opacity,
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};

export interface ViewElementStyle
  extends Pick<
    ContainerStyles,
    | 'borderStyle'
    | 'borderColor'
    | 'borderTopWidth'
    | 'borderRightWidth'
    | 'borderBottomWidth'
    | 'borderLeftWidth'
    | 'borderRadiusTopLeft'
    | 'borderRadiusTopRight'
    | 'borderRadiusBottomRight'
    | 'borderRadiusBottomLeft'
  > {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  widthUnit: SizeUnit;
  maxWidthUnit: SizeUnit;
  backgroundColor: string;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

export const DefaultViewElementStyle: ViewElementStyle = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  backgroundColor: 'transparent',
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};

export interface ImageViewerElementStyle
  extends Pick<
      ContainerStyles,
      | 'borderStyle'
      | 'borderColor'
      | 'borderTopWidth'
      | 'borderRightWidth'
      | 'borderBottomWidth'
      | 'borderLeftWidth'
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
  widthUnit: SizeUnit;
  maxWidthUnit: SizeUnit;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

export const DefaultImageViewerElementStyle: ImageViewerElementStyle = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  opacity: DefaultTypographyStyles.opacity,
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};

export interface EditorElementStyle
  extends Pick<
      ContainerStyles,
      | 'paddingTop'
      | 'paddingRight'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'borderStyle'
      | 'borderColor'
      | 'borderTopWidth'
      | 'borderRightWidth'
      | 'borderBottomWidth'
      | 'borderLeftWidth'
      | 'borderRadiusTopLeft'
      | 'borderRadiusTopRight'
      | 'borderRadiusBottomRight'
      | 'borderRadiusBottomLeft'
    >,
    Pick<
      TypographyStyles,
      'font-family' | 'font-weight' | 'color' | 'opacity'
    > {
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  widthUnit: SizeUnit;
  maxWidthUnit: SizeUnit;
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}

export const DefaultEditorElementStyle: EditorElementStyle = {
  paddingTop: 1,
  paddingRight: 1,
  paddingBottom: 1,
  paddingLeft: 1,
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  'font-family': DefaultTypographyStyles['font-family'],
  'font-weight': DefaultTypographyStyles['font-weight'],
  color: DefaultTypographyStyles.color,
  opacity: DefaultTypographyStyles.opacity,
  width: 100,
  height: 0,
  maxWidth: 100,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
  'margin-top': 0,
  'margin-right': 0,
  'margin-bottom': 0,
  'margin-left': 0,
};

export const DefaultImageElementStyle: ImageElementStyle = {
  borderStyle: DefaultContainerStyles.borderStyle,
  borderColor: DefaultContainerStyles.borderColor,
  borderTopWidth: DefaultContainerStyles.borderTopWidth,
  borderRightWidth: DefaultContainerStyles.borderRightWidth,
  borderBottomWidth: DefaultContainerStyles.borderBottomWidth,
  borderLeftWidth: DefaultContainerStyles.borderLeftWidth,
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
