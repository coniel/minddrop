import { CanvasNodeFrame, CanvasNodeResizeState } from '../../types';

/**
 * The bounds a resize is clamped to, in canvas coordinates. A
 * dimension is Infinity while the workspace is unmeasured.
 */
export interface CanvasNodeResizeBounds {
  /**
   * The workspace width.
   */
  width: number;

  /**
   * The workspace height.
   */
  height: number;
}

export interface GetResizedNodeFrameOptions {
  /**
   * The minimum width the node can be resized to.
   */
  minWidth: number;

  /**
   * The minimum height the node can be resized to.
   */
  minHeight: number;

  /**
   * Whether the resize mirrors around the node's center, moving
   * the opposite edge by the same distance.
   */
  mirror: boolean;

  /**
   * The workspace the node is clamped to, or null for unbounded
   * nodes living in infinite canvas coordinates.
   */
  bounds: CanvasNodeResizeBounds | null;
}

/**
 * Returns the frame values a resize lands on for the given
 * deltas, clamped to the minimum size and the workspace bounds.
 * Only the values the dragged edge changes are returned, leaving
 * the rest of the node's frame as it is.
 *
 * @param state - The in-progress resize.
 * @param deltaX - The horizontal distance the moving edge travelled.
 * @param deltaY - The vertical distance the moving edge travelled.
 * @param options - The size limits and workspace bounds.
 * @returns The changed frame values in canvas coordinates.
 */
export function getResizedNodeFrame(
  state: CanvasNodeResizeState,
  deltaX: number,
  deltaY: number,
  options: GetResizedNodeFrameOptions,
): Partial<CanvasNodeFrame> {
  const { edge, originWidth, originHeight, originX, originY } = state;
  const { minWidth, minHeight, mirror, bounds } = options;

  // Workspace-bounds clamps only apply to bounded nodes; canvas
  // nodes resize freely in canvas coordinates
  const workspaceWidth = bounds ? bounds.width : Infinity;
  const workspaceHeight = bounds ? bounds.height : Infinity;
  const minPosition = bounds ? 0 : -Infinity;

  // Anchored edges: the opposite edge from the one being dragged
  // stays fixed.
  const rightEdge = originX + originWidth;
  const bottomEdge = originY + originHeight;

  const centerX = originX + originWidth / 2;
  const centerY = originY + originHeight / 2;

  // Mirror-resize width/height caps that keep the node's leading
  // edge inside the workspace in bounded mode
  const maxMirrorWidth = bounds ? centerX * 2 : Infinity;
  const maxMirrorHeight = bounds ? centerY * 2 : Infinity;

  switch (edge) {
    case 'right': {
      const width = Math.min(
        Math.max(minWidth, originWidth + deltaX * (mirror ? 2 : 1)),
        mirror ? maxMirrorWidth : workspaceWidth - originX,
      );

      // Mirrored resizes shift the node to keep its center in
      // place
      if (mirror) {
        return { width, x: centerX - width / 2 };
      }

      return { width };
    }

    case 'left': {
      if (mirror) {
        const width = Math.min(
          Math.max(minWidth, originWidth - deltaX * 2),
          (workspaceWidth - centerX) * 2,
        );

        return { width, x: centerX - width / 2 };
      }

      const x = Math.max(
        minPosition,
        Math.min(rightEdge - minWidth, originX + deltaX),
      );

      return { width: rightEdge - x, x };
    }

    case 'bottom': {
      const height = Math.min(
        Math.max(minHeight, originHeight + deltaY * (mirror ? 2 : 1)),
        mirror ? maxMirrorHeight : workspaceHeight - originY,
      );

      if (mirror) {
        return { height, y: centerY - height / 2 };
      }

      return { height };
    }

    case 'top-left': {
      if (mirror) {
        const width = Math.min(
          Math.max(minWidth, originWidth - deltaX * 2),
          (workspaceWidth - centerX) * 2,
        );
        const height = Math.min(
          Math.max(minHeight, originHeight - deltaY * 2),
          (workspaceHeight - centerY) * 2,
        );

        return {
          width,
          height,
          x: centerX - width / 2,
          y: centerY - height / 2,
        };
      }

      const x = Math.max(
        minPosition,
        Math.min(rightEdge - minWidth, originX + deltaX),
      );
      const y = Math.max(
        minPosition,
        Math.min(bottomEdge - minHeight, originY + deltaY),
      );

      return { width: rightEdge - x, height: bottomEdge - y, x, y };
    }

    case 'top-right': {
      if (mirror) {
        const width = Math.min(
          Math.max(minWidth, originWidth + deltaX * 2),
          maxMirrorWidth,
        );
        const height = Math.min(
          Math.max(minHeight, originHeight - deltaY * 2),
          (workspaceHeight - centerY) * 2,
        );

        return {
          width,
          height,
          x: centerX - width / 2,
          y: centerY - height / 2,
        };
      }

      const width = Math.min(
        Math.max(minWidth, originWidth + deltaX),
        workspaceWidth - originX,
      );
      const y = Math.max(
        minPosition,
        Math.min(bottomEdge - minHeight, originY + deltaY),
      );

      return { width, height: bottomEdge - y, y };
    }

    case 'bottom-left': {
      if (mirror) {
        const width = Math.min(
          Math.max(minWidth, originWidth - deltaX * 2),
          (workspaceWidth - centerX) * 2,
        );
        const height = Math.min(
          Math.max(minHeight, originHeight + deltaY * 2),
          maxMirrorHeight,
        );

        return {
          width,
          height,
          x: centerX - width / 2,
          y: centerY - height / 2,
        };
      }

      const x = Math.max(
        minPosition,
        Math.min(rightEdge - minWidth, originX + deltaX),
      );
      const height = Math.min(
        Math.max(minHeight, originHeight + deltaY),
        workspaceHeight - originY,
      );

      return { width: rightEdge - x, height, x };
    }

    case 'bottom-right': {
      if (mirror) {
        const width = Math.min(
          Math.max(minWidth, originWidth + deltaX * 2),
          maxMirrorWidth,
        );
        const height = Math.min(
          Math.max(minHeight, originHeight + deltaY * 2),
          maxMirrorHeight,
        );

        return {
          width,
          height,
          x: centerX - width / 2,
          y: centerY - height / 2,
        };
      }

      const width = Math.min(
        Math.max(minWidth, originWidth + deltaX),
        workspaceWidth - originX,
      );
      const height = Math.min(
        Math.max(minHeight, originHeight + deltaY),
        workspaceHeight - originY,
      );

      return { width, height };
    }
  }
}
