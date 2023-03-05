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
    labelKey: 'colorDefault',
    value: 'default',
  },
  {
    labelKey: 'colorBlue',
    value: 'blue',
  },
  {
    labelKey: 'colorCyan',
    value: 'cyan',
  },
  {
    labelKey: 'colorRed',
    value: 'red',
  },
  {
    labelKey: 'colorPink',
    value: 'pink',
  },
  {
    labelKey: 'colorPurple',
    value: 'purple',
  },
  {
    labelKey: 'colorGreen',
    value: 'green',
  },
  {
    labelKey: 'colorOrange',
    value: 'orange',
  },
  {
    labelKey: 'colorYellow',
    value: 'yellow',
  },
  {
    labelKey: 'colorBrown',
    value: 'brown',
  },
  {
    labelKey: 'colorGray',
    value: 'gray',
  },
];
