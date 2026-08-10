/**
 * The axis an alignment guide aligns nodes along: 'x' for a
 * vertical guide aligning horizontal positions, 'y' for a
 * horizontal one.
 */
export type CanvasAlignmentAxis = 'x' | 'y';

/**
 * A line drawn between a node being moved and the nodes it is
 * aligned with, in canvas coordinates.
 */
export interface CanvasAlignmentGuide {
  /**
   * The axis the guide aligns nodes along.
   */
  axis: CanvasAlignmentAxis;

  /**
   * The guide's coordinate on its axis.
   */
  position: number;

  /**
   * The guide's start coordinate on the perpendicular axis.
   */
  start: number;

  /**
   * The guide's end coordinate on the perpendicular axis.
   */
  end: number;
}
