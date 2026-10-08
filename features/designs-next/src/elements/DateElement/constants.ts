import { DateMode, DateStyle } from '@minddrop/utils';

/**
 * The mode a date element reads in when none is set.
 */
export const DefaultDateMode: DateMode = 'date';

/**
 * The length a date element is formatted at when none is set.
 */
export const DefaultDateStyle: DateStyle = 'medium';

/**
 * Whether a date element shows the time when none is set.
 */
export const DefaultDateShowTime = false;

/**
 * The modes in display order.
 */
export const DateModes: DateMode[] = ['date', 'relative'];

/**
 * The date styles in display order, from the shortest.
 */
export const DateStyles: DateStyle[] = [
  'compact',
  'short',
  'medium',
  'long',
  'full',
];
