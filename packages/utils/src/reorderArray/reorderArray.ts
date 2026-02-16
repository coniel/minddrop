/**
 * Reorders an array by moving an element to a new index
 * @param array - The original array of element IDs
 * @param movedId - The ID of the element that was moved
 * @param targetIndex - The index where the element should be placed
 * @returns A new array with the element moved to the target index
 */
export function reorderArray<T>(
  array: T[],
  movedId: T,
  targetIndex: number,
): T[] {
  // Find the current index of the moved element
  const currentIndex = array.indexOf(movedId);

  // If element not found, return original array
  if (currentIndex === -1) {
    return [...array];
  }

  // Create a copy of the array
  const result = [...array];

  // Remove the element from its current position
  result.splice(currentIndex, 1);

  // Insert it at the adjusted target index
  result.splice(targetIndex, 0, movedId);

  return result;
}
