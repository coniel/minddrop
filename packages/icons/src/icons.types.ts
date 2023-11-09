import { UiIcons } from './ui-icons.min';
import { ContentIcons } from './content-icons.min';
import { HTMLProps } from 'react';

export type UiIconName = keyof typeof UiIcons;
export type ContentIconName = keyof typeof ContentIcons;

export type UiIconSet = Record<
  UiIconName,
  React.ComponentType<HTMLProps<SVGSVGElement>>
>;
export type ContentIconSet = Record<
  ContentIconName,
  React.ComponentType<HTMLProps<SVGSVGElement>>
>;
