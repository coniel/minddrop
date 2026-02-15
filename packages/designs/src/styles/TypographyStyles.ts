import { ContentColor } from '@minddrop/utils';

export type FontFamily = 'sans' | 'serif' | 'mono';

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
  'text-align': 'left' | 'center' | 'right';
  // The maximum number of lines to display
  truncate: number;
}

export const fonts: FontFamily[] = ['sans', 'serif', 'mono'];

export const fontWeights = [
  {
    name: 'designs.typography.font-weight.100',
    value: 100,
  },
  {
    name: 'designs.typography.font-weight.200',
    value: 200,
  },
  {
    name: 'designs.typography.font-weight.300',
    value: 300,
  },
  {
    name: 'designs.typography.font-weight.400',
    value: 400,
  },
  {
    name: 'designs.typography.font-weight.500',
    value: 500,
  },
  {
    name: 'designs.typography.font-weight.600',
    value: 600,
  },
  {
    name: 'designs.typography.font-weight.700',
    value: 700,
  },
  {
    name: 'designs.typography.font-weight.800',
    value: 800,
  },
  {
    name: 'designs.typography.font-weight.900',
    value: 900,
  },
];

export const DefaultTypographyStyles: TypographyStyles = {
  'font-family': fonts[0],
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
