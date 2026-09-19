/**
 * Returns whether a scroll position can move by a distance without
 * leaving its extent: backwards from past the start, or forwards
 * from short of the end. A zero distance moves nowhere.
 *
 * @param scrollPosition - The current scroll position.
 * @param maxScrollPosition - The furthest scroll position.
 * @param distance - The distance to move, negative for backwards.
 * @returns Whether the position can move.
 */
export function canScrollBy(
  scrollPosition: number,
  maxScrollPosition: number,
  distance: number,
): boolean {
  // Check if the move is backwards. If so, the position can move
  // while past the start.
  if (distance < 0) {
    return scrollPosition > 0;
  }

  // Check if the move is forwards. If so, the position can move
  // while short of the end.
  if (distance > 0) {
    return scrollPosition < maxScrollPosition;
  }

  // A zero distance moves nowhere
  return false;
}
