import {
  NumberNotation,
  NumberSeparator,
  NumberSignDisplay,
} from '@minddrop/utils';

/**
 * The separator a number element groups its digits with when none
 * is set.
 */
export const DefaultNumberSeparator: NumberSeparator = 'none';

/**
 * The sign display a number element takes when none is set.
 */
export const DefaultNumberSignDisplay: NumberSignDisplay = 'auto';

/**
 * The notation a number element is written in when none is set.
 */
export const DefaultNumberNotation: NumberNotation = 'standard';

/**
 * The decimal places a number element can be set to, in display
 * order.
 */
export const NumberDecimalPlaces: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * The separators in display order.
 */
export const NumberSeparators: NumberSeparator[] = [
  'none',
  'comma',
  'period',
  'space',
];

/**
 * The sign displays in display order.
 */
export const NumberSignDisplays: NumberSignDisplay[] = [
  'auto',
  'always',
  'never',
];

/**
 * The number an unmapped element writes.
 */
export const SampleNumber = 12345.678;
