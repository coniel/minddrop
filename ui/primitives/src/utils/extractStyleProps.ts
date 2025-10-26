import { StyleProps } from '../types';

export function extractStyleProps<T extends Record<string, unknown>>(
  props: T,
): { styleProps: Partial<StyleProps>; otherProps: Omit<T, keyof StyleProps> } {
  const stylePropKeys = new Set<keyof StyleProps>([
    'm',
    'my',
    'mx',
    'mt',
    'mb',
    'ms',
    'me',
    'ml',
    'mr',
    'p',
    'py',
    'px',
    'pt',
    'pb',
    'ps',
    'pe',
    'pl',
    'pr',
    'br',
    'btlr',
    'btrr',
    'bblr',
    'bbrr',
    'bd',
    'bg',
    'c',
    'opacity',
    'ff',
    'fz',
    'fw',
    'lts',
    'ta',
    'lh',
    'fs',
    'tt',
    'td',
    'w',
    'miw',
    'maw',
    'h',
    'mih',
    'mah',
    'bgsz',
    'bgp',
    'bgr',
    'bga',
    'pos',
    'top',
    'left',
    'bottom',
    'right',
    'inset',
    'display',
    'flex',
  ]);

  const styleProps: Partial<StyleProps> = {};
  const otherProps: Record<string, unknown> = {};

  for (const key in props) {
    if (stylePropKeys.has(key as keyof StyleProps)) {
      (styleProps as Record<string, unknown>)[key] = props[key];
    } else {
      otherProps[key] = props[key];
    }
  }

  return { styleProps, otherProps: otherProps as Omit<T, keyof StyleProps> };
}
