import { UiIconName } from '@minddrop/icons';

export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';

const i18nKey = (key: string) => `designs.border.${key}`;

export const borderStyles: {
  label: string;
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
  borderRadius: number;
  padding?: number;
}

export const DefaultContainerStyles: ContainerStyles = {
  direction: 'column',
  backgroundColor: 'default',
  alignItems: 'start',
  justifyContent: 'start',
  wrap: false,
  gap: 8,
  borderRadius: 8,
  borderStyle: 'none',
  borderColor: 'default',
  borderWidth: 1,
  padding: 0,
};
