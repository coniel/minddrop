/**
 * Reorders an array by moving an element from one index to another
 * @param array - The original array of elements
 * @param fromIndex - The current index of the element to move
 * @param toIndex - The index where the element should be placed
 * @returns A new array with the element moved to the target index
 */
export function reorderArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  // Validate indices
  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0) {
    return [...array];
  }

  // Create a copy of the array
  const result = [...array];

  // Remove the element from its current position
  const [movedElement] = result.splice(fromIndex, 1);

  // Insert it at the target index
  result.splice(toIndex, 0, movedElement);

  return result;
}
