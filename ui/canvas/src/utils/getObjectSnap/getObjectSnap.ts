import { ALIGNMENT_TOLERANCE } from '../../constants';
import {
  CanvasAlignmentAxis,
  CanvasAlignmentGuide,
  CanvasNodeFrame,
} from '../../types';
import { getAlignmentLines } from '../getAlignmentLines';
import { getGuideSpan } from '../getGuideSpan';

/**
 * A frame snapped to the nodes it aligns with, and the guides
 * showing the alignments.
 */
export interface ObjectSnapResult {
  /**
   * The snapped horizontal position.
   */
  x: number;

  /**
   * The snapped vertical position.
   */
  y: number;

  /**
   * The guides between the snapped frame and the frames it aligns
   * with.
   */
  guides: CanvasAlignmentGuide[];
}

/**
 * Snaps a frame's position to the nearest alignment lines (edges
 * and centers) of other frames on each axis.
 *
 * @param frame - The frame being moved, in canvas coordinates.
 * @param targets - The frames to align to, in canvas coordinates.
 * @param threshold - The maximum snapping distance in canvas units.
 * @returns The snapped position and the guides it aligns along.
 */
export function getObjectSnap(
  frame: CanvasNodeFrame,
  targets: CanvasNodeFrame[],
  threshold: number,
): ObjectSnapResult {
  // Each axis snaps independently, so a frame can align to one
  // node horizontally and another vertically
  const snapped = {
    ...frame,
    x: frame.x + getAxisSnapOffset(frame, targets, threshold, 'x'),
    y: frame.y + getAxisSnapOffset(frame, targets, threshold, 'y'),
  };

  return {
    x: snapped.x,
    y: snapped.y,
    // Guides are collected from the snapped frame, so they cover
    // every alignment the snapped position lands on
    guides: [
      ...getAxisGuides(snapped, targets, 'x'),
      ...getAxisGuides(snapped, targets, 'y'),
    ],
  };
}

/**
 * Returns the distance the frame moves along an axis to land on
 * the nearest target alignment line, or 0 when no target line
 * lies within the threshold.
 */
function getAxisSnapOffset(
  frame: CanvasNodeFrame,
  targets: CanvasNodeFrame[],
  threshold: number,
  axis: CanvasAlignmentAxis,
): number {
  const lines = getAlignmentLines(frame, axis);

  // The smallest offset found so far
  let offset = 0;
  let distance = Infinity;

  targets.forEach((target) => {
    getAlignmentLines(target, axis).forEach((targetLine) => {
      lines.forEach((line) => {
        const lineOffset = targetLine - line;
        const lineDistance = Math.abs(lineOffset);

        // Too far to snap to
        if (lineDistance > threshold) {
          return;
        }

        // Keep the nearest alignment line
        if (lineDistance < distance) {
          offset = lineOffset;
          distance = lineDistance;
        }
      });
    });
  });

  return offset;
}

/**
 * Returns a guide for each target frame alignment line the frame
 * sits exactly on, spanning both frames.
 */
function getAxisGuides(
  frame: CanvasNodeFrame,
  targets: CanvasNodeFrame[],
  axis: CanvasAlignmentAxis,
): CanvasAlignmentGuide[] {
  const lines = getAlignmentLines(frame, axis);
  const span = getGuideSpan(frame, axis);

  // Guides by position, so a line shared by several targets is
  // drawn once, spanning all of them
  const guides = new Map<number, CanvasAlignmentGuide>();

  targets.forEach((target) => {
    const targetSpan = getGuideSpan(target, axis);

    getAlignmentLines(target, axis).forEach((targetLine) => {
      // Whether any of the frame's lines sits on the target line
      const aligned = lines.some(
        (line) => Math.abs(line - targetLine) < ALIGNMENT_TOLERANCE,
      );

      if (!aligned) {
        return;
      }

      const guide = guides.get(targetLine);

      // Extend the existing guide over the target
      if (guide) {
        guide.start = Math.min(guide.start, targetSpan.start);
        guide.end = Math.max(guide.end, targetSpan.end);

        return;
      }

      // Start a guide spanning the frame and the target
      guides.set(targetLine, {
        axis,
        position: targetLine,
        start: Math.min(span.start, targetSpan.start),
        end: Math.max(span.end, targetSpan.end),
      });
    });
  });

  return Array.from(guides.values());
}
