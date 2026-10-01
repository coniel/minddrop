import { JsonValue } from '../types';

/**
 * Returns the value as JSON holds it: a round trip through JSON which
 * drops fields left undefined.
 *
 * @param value - The value to convert.
 * @returns The value as JSON holds it.
 */
export function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value));
}
