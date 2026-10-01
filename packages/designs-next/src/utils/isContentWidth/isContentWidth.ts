import { ContentWidths } from '../../constants';
import { ContentWidth } from '../../types';

/**
 * Checks whether a value is a content width.
 *
 * @param value - The value to check.
 * @returns Whether the value is a content width.
 */
export function isContentWidth(value: unknown): value is ContentWidth {
  return (
    typeof value === 'string' && ContentWidths.some((width) => width === value)
  );
}
