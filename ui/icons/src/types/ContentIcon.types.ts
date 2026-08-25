import { HTMLProps } from 'react';
import type { ContentIcons } from '../content-icons.min';

export type ContentIconName = keyof typeof ContentIcons;

export type ContentIconComponent = React.ComponentType<
  HTMLProps<SVGSVGElement>
>;

export type ContentIconSet = Record<string, ContentIconComponent>;
