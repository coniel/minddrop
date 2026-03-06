import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';

export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';

const i18nKey = createI18nKeyBuilder('designs.border.');

export const borderStyles: {
  label: TranslationKey;
  value: BorderStyle;
  icon: UiIconName;
}[] = [
  {
    label: i18nKey('style.none'),
    value: 'none',
    icon: 'ban',
  },
  {
    label: i18nKey('style.solid'),
    value: 'solid',
    icon: 'minus',
  },
  {
    label: i18nKey('style.dashed'),
    value: 'dashed',
    icon: 'move-horizontal',
  },
  {
    label: i18nKey('style.dotted'),
    value: 'dotted',
    icon: 'ellipsis',
  },
];

export type ContainerDirection = 'row' | 'column';
export type ContainerAlign = 'start' | 'center' | 'end';
export type ContainerJustify = 'start' | 'center' | 'end';
export type GradientDirection = 'to-top' | 'to-bottom' | 'to-left' | 'to-right';

export interface ContainerStyles {
  direction: ContainerDirection;
  backgroundColor: string;
  alignItems: ContainerAlign;
  justifyContent: ContainerJustify;
  wrap: boolean;
  gap: number;
  borderStyle: BorderStyle;
  borderColor: string;
  borderWidth: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomRight: number;
  borderRadiusBottomLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  stretch: boolean;
  minHeight?: number;
  backgroundImage: string;
  backgroundImageFit: 'cover' | 'contain' | 'fill';
  backdropBlur: number;
  backdropBrightness: number;
  backdropBlurGradient: boolean;
  backdropBlurGradientDirection: GradientDirection;
  backdropBlurGradientExtent: number;
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
  widthUnit: 'px' | '%';
  maxWidthUnit: 'px' | '%';
}

export const DefaultContainerStyles: ContainerStyles = {
  direction: 'column',
  backgroundColor: 'default',
  alignItems: 'start',
  justifyContent: 'start',
  wrap: false,
  stretch: true,
  gap: 8,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomRight: 0,
  borderRadiusBottomLeft: 0,
  borderStyle: 'none',
  borderColor: 'default',
  borderWidth: 1,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  backgroundImage: '',
  backgroundImageFit: 'cover',
  backdropBlur: 0,
  backdropBrightness: 100,
  backdropBlurGradient: false,
  backdropBlurGradientDirection: 'to-top',
  backdropBlurGradientExtent: 50,
  width: 0,
  height: 0,
  maxWidth: 0,
  maxHeight: 0,
  widthUnit: '%',
  maxWidthUnit: '%',
};
