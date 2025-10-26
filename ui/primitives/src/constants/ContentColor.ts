import { ContentColor } from '../types';

export interface ColorValue {
  /**
   * The i18n label key.
   */
  labelKey: string;

  /**
   * The color value.
   */
  value: ContentColor;
}

export const ContentColors: ColorValue[] = [
  {
    labelKey: 'color.default',
    value: 'default',
  },
  {
    labelKey: 'color.blue',
    value: 'blue',
  },
  {
    labelKey: 'color.cyan',
    value: 'cyan',
  },
  {
    labelKey: 'color.red',
    value: 'red',
  },
  {
    labelKey: 'color.pink',
    value: 'pink',
  },
  {
    labelKey: 'color.purple',
    value: 'purple',
  },
  {
    labelKey: 'color.green',
    value: 'green',
  },
  {
    labelKey: 'color.orange',
    value: 'orange',
  },
  {
    labelKey: 'color.yellow',
    value: 'yellow',
  },
  {
    labelKey: 'color.brown',
    value: 'brown',
  },
  {
    labelKey: 'color.gray',
    value: 'gray',
  },
];
