/**
 * Deeply merges two objects.
 *
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @returns The merged object.
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const k = key as keyof T;
      const sourceValue = source[k];
      const targetValue = target[k];

      if (
        sourceValue !== undefined &&
        targetValue !== undefined &&
        typeof sourceValue === 'object' &&
        typeof targetValue === 'object' &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue) &&
        sourceValue !== null &&
        targetValue !== null
      ) {
        result[k] = deepMerge(targetValue, sourceValue) as T[keyof T];
      } else if (sourceValue !== undefined) {
        result[k] = sourceValue as T[keyof T];
      }
    }
  }

  return result;
}
