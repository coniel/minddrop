import { UiIconName } from '@minddrop/icons';
import { ContentColor } from '@minddrop/theme';

const i18nKey = (key: string) => `designs.typography.${key}`;

export type FontFamily = 'inherit' | 'sans' | 'serif' | 'mono';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface TypographyStyles {
  'font-family': FontFamily;
  'font-weight': FontWeight;
  'font-size': number;
  'line-height': number;
  'letter-spacing': number;
  underline: boolean;
  italic: boolean;
  align: TextAlign;
  'text-transform': TextTransform;
  color: ContentColor | string;
  opacity: number;
  'text-align': TextAlign;
  // The maximum number of lines to display
  truncate: number;
}

const fontValues: FontFamily[] = ['inherit', 'sans', 'serif', 'mono'];
const weightValues: FontWeight[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export const fonts: { label: string; value: FontFamily }[] = fontValues.map(
  (font) => ({
    label: i18nKey(`font-family.${font}`),
    value: font,
  }),
);

export const fontWeights = weightValues.map((weight) => ({
  label: i18nKey(`font-weight.${weight}`),
  value: weight,
}));

export const textAligns: {
  label: string;
  value: TextAlign;
  icon: UiIconName;
}[] = [
  {
    label: i18nKey('text-align.left'),
    value: 'left',
    icon: 'align-left',
  },
  {
    label: i18nKey('text-align.center'),
    value: 'center',
    icon: 'align-center',
  },
  {
    label: i18nKey('text-align.right'),
    value: 'right',
    icon: 'align-right',
  },
  {
    label: i18nKey('text-align.justify'),
    value: 'justify',
    icon: 'align-justify',
  },
];

export const textTransforms: {
  label: string;
  value: TextTransform;
  icon: UiIconName;
}[] = [
  {
    label: i18nKey('text-transform.none'),
    value: 'none',
    icon: 'minus',
  },
  {
    label: i18nKey('text-transform.uppercase'),
    icon: 'case-upper',
    value: 'uppercase',
  },
  {
    label: i18nKey('text-transform.lowercase'),
    icon: 'case-lower',
    value: 'lowercase',
  },
  {
    label: i18nKey('text-transform.capitalize'),
    icon: 'case-sensitive',
    value: 'capitalize',
  },
];
export const DefaultTypographyStyles: TypographyStyles = {
  'font-family': fonts[0].value,
  'font-weight': fontWeights[3].value,
  'font-size': 1,
  'line-height': 1.5,
  'letter-spacing': 0,
  underline: false,
  italic: false,
  align: 'left',
  'text-transform': 'none',
  color: 'default',
  opacity: 1,
  'text-align': 'left',
  truncate: 0,
};
