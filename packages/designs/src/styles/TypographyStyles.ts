import { ContentColor } from '@minddrop/utils';

const i18nKey = (key: string) => `designs.typography.${key}`;

export type FontFamily = 'inherit' | 'sans' | 'serif' | 'mono';
export type TextAlign = 'left' | 'center' | 'right';

export interface TypographyStyles {
  'font-family': FontFamily;
  'font-weight': number;
  'font-size': number;
  'line-height': number;
  'letter-spacing': number;
  underline: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  color: ContentColor | string;
  'text-transform': 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  'text-align': TextAlign;
  // The maximum number of lines to display
  truncate: number;
}

const fontValues: FontFamily[] = ['inherit', 'sans', 'serif', 'mono'];
const weightValues = [100, 200, 300, 400, 500, 600, 700, 800, 900];

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

export const DefaultTypographyStyles: TypographyStyles = {
  'font-family': fonts[0].value,
  'font-weight': fontWeights[3].value,
  'font-size': 1,
  'line-height': 1.5,
  'letter-spacing': 0,
  underline: false,
  italic: false,
  align: 'left',
  color: 'default',
  'text-transform': 'none',
  'text-align': 'left',
  truncate: 0,
};
