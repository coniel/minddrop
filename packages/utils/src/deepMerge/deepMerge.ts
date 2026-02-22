/**
 * Deeply merges two objects.
 *
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @returns The merged object.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);

  return proto === Object.prototype || proto === null;
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const k = key as keyof T;
      const sourceValue = source[k];
      const targetValue = target[k];

      if (
        sourceValue !== undefined &&
        isPlainObject(sourceValue) &&
        isPlainObject(targetValue)
      ) {
        result[k] = deepMerge(
          targetValue,
          sourceValue as unknown as Partial<typeof targetValue>,
        ) as T[keyof T];
      } else if (sourceValue !== undefined) {
        result[k] = sourceValue as T[keyof T];
      }
    }
  }

  return result;
}
