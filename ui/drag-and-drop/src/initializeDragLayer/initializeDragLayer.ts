import {
  ActiveDrag,
  DragAndDrop,
  DragEndedEventData,
  PointerPosition,
} from '@minddrop/drag-and-drop';
import { Events } from '@minddrop/events';
import { resolveNearestElement, waitFrames } from '@minddrop/utils';
import { cloneForPreview } from '../utils';
import './DragLayer.css';

// How long the preview takes to settle into place or return to its
// source when the theme's duration token cannot be read, in
// milliseconds.
const FALLBACK_SETTLE_DURATION = 200;

// The easing the preview settles with when the theme's easing token
// cannot be read.
const FALLBACK_SETTLE_EASING = 'ease-out';

// How many frames the preview waits for the dropped item to be
// rendered where it landed before fading out where it is.
const SETTLE_FRAMES = 2;

/**
 * Mounts the layer showing a drag's preview following the pointer.
 *
 * @returns A function which removes the layer.
 */
export function initializeDragLayer(): VoidFunction {
  // Create the layer element
  const layer = document.createElement('div');

  // Mount the layer
  layer.className = 'drag-layer';
  document.body.appendChild(layer);

  // The preview of the drag in progress, null between drags
  let preview: DragPreview | null = null;

  // Clone the dragged element as the drag starts, before the source
  // re-renders as dragging and hides or collapses itself.
  function handleActiveDragChange(drag: ActiveDrag | null): void {
    if (!drag) {
      return;
    }

    // Remove a preview still settling from the previous drag
    preview?.remove();

    // Get the element to clone
    const element = DragAndDrop.getPreviewElement();

    if (!element) {
      return;
    }

    // Create the preview
    preview = createDragPreview(layer, element);
  }

  // Animate the preview out as the drag ends
  function handleEnded({ drag, dropped }: DragEndedEventData): void {
    if (!preview) {
      return;
    }

    // Keep the preview to animate it out
    const ending = preview;

    // Clear the slot for the next drag
    preview = null;

    // Stop the preview following the pointer
    ending.stopFollowing();

    // Check if the drag was cancelled. If so, return the preview to
    // its source.
    if (!dropped) {
      ending.returnToSource();

      return;
    }

    // Settle the preview into the dropped item's place
    ending.settle(drag);
  }

  // Create a preview as each drag starts
  const unsubscribe = DragAndDrop.subscribeToActiveDrag(handleActiveDragChange);

  // End the preview as each drag ends
  Events.addListener(DragAndDrop.events.Ended, 'drag-layer', handleEnded);

  // Remove the layer and its listeners
  return () => {
    unsubscribe();
    Events.removeListener(DragAndDrop.events.Ended, 'drag-layer');
    preview?.remove();
    layer.remove();
  };
}

interface DragPreview {
  /**
   * Stops the preview following the pointer.
   */
  stopFollowing: VoidFunction;

  /**
   * Animates the preview back to where the drag started, then
   * removes it.
   */
  returnToSource: VoidFunction;

  /**
   * Animates the preview into the place the dropped item is rendered
   * at, or fades it out in place when the item is not rendered. A
   * copied item's source does not count as such a place. Removes the
   * preview after.
   */
  settle: (drag: ActiveDrag) => void;

  /**
   * Removes the preview at once.
   */
  remove: VoidFunction;
}

interface PreviewTarget {
  /**
   * Where the preview ends up horizontally, relative to where it
   * started.
   */
  x: number;

  /**
   * Where the preview ends up vertically, relative to where it
   * started.
   */
  y: number;

  /**
   * The opacity the preview ends up at.
   */
  opacity: number;
}

/**
 * Clones the dragged element into the layer at its own position and
 * sets it following the pointer.
 *
 * @param layer - The layer to mount the clone in.
 * @param element - The dragged element.
 * @returns The preview.
 */
function createDragPreview(layer: HTMLElement, element: Element): DragPreview {
  // Measure the element
  const rect = element.getBoundingClientRect();
  // Clone the element
  const clone = cloneForPreview(element);
  // Read the pointer's position
  const origin = DragAndDrop.getPointerPosition();

  // Compute the pointer's offset within the element
  const offset = { x: origin.x - rect.left, y: origin.y - rect.top };

  // Position the clone over the element
  clone.classList.add('drag-layer-preview');
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;

  // Mount the clone in the layer
  layer.appendChild(clone);

  // Resolve the zoom the element's ancestors apply to it, from the
  // difference between its measured and laid out width.
  const zoom = clone.offsetWidth ? rect.width / clone.offsetWidth : 1;

  // Scale the clone to match, as it sits outside those ancestors
  clone.style.scale = `${zoom}`;

  // Lift the clone on the next frame, so that the lift transitions
  requestAnimationFrame(() => {
    clone.classList.add('drag-layer-preview-lifted');
  });

  // Where the clone sits relative to its starting position
  let translation = { x: 0, y: 0 };

  // Move the clone to keep the pointer's offset within it
  function follow(position: PointerPosition): void {
    // Compute the clone's translation from the pointer position
    translation = {
      x: position.x - offset.x - rect.left,
      y: position.y - offset.y - rect.top,
    };

    // Apply the translation
    clone.style.translate = `${translation.x}px ${translation.y}px`;
  }

  // Follow the pointer
  const unsubscribe = DragAndDrop.subscribeToMove(follow);

  // Remove the clone and stop following the pointer
  function remove(): void {
    unsubscribe();
    clone.remove();
  }

  // Animate the clone to a position and opacity, then remove it
  function animateTo(target: PreviewTarget): void {
    // Remove the lifted styling
    clone.classList.remove('drag-layer-preview-lifted');

    // Check if the environment animates. If not, remove the preview
    // at once.
    if (typeof clone.animate !== 'function') {
      remove();

      return;
    }

    // Animate the clone from where it is to the target
    const animation = clone.animate(
      [
        { translate: `${translation.x}px ${translation.y}px`, opacity: 1 },
        {
          translate: `${target.x}px ${target.y}px`,
          opacity: target.opacity,
        },
      ],
      { ...resolveSettleTiming(clone), fill: 'forwards' },
    );

    // Remove the clone once the animation ends
    animation.onfinish = remove;
    animation.oncancel = remove;
  }

  // Animate the clone into the dropped item's place
  function settle(drag: ActiveDrag): void {
    // Wait a few frames for the dropped item to render where it landed
    waitFrames(SETTLE_FRAMES, () => {
      // Find the elements rendering the item. A copy leaves its source
      // as it was, so the source is not where the copy landed.
      const candidates = DragAndDrop.resolveDraggableElements(drag.id).filter(
        (candidate) => drag.effect !== 'copy' || candidate !== element,
      );

      // Find the candidate nearest the pointer
      const destination = resolveNearestElement(
        candidates,
        DragAndDrop.getPointerPosition(),
      );

      // Check if the item is rendered. If not, fade the clone out in
      // place.
      if (!destination) {
        animateTo({ ...translation, opacity: 0 });

        return;
      }

      // Measure the destination
      const destinationRect = destination.getBoundingClientRect();

      // Animate the clone onto the destination, fading out
      animateTo({
        x: destinationRect.left - rect.left,
        y: destinationRect.top - rect.top,
        opacity: 0,
      });
    });
  }

  // Return the preview
  return {
    stopFollowing: unsubscribe,
    returnToSource: () => animateTo({ x: 0, y: 0, opacity: 1 }),
    settle,
    remove,
  };
}

/**
 * Resolves the duration and easing the preview settles with from
 * the theme's motion tokens. Falls back to defaults when they cannot
 * be read.
 *
 * @param element - The element to read the tokens from.
 * @returns The settle timing.
 */
function resolveSettleTiming(element: Element): {
  duration: number;
  easing: string;
} {
  // Read the theme's motion tokens off the element
  const style = getComputedStyle(element);
  const duration = parseFloat(style.getPropertyValue('--duration-normal'));
  const easing = style.getPropertyValue('--ease-out').trim();

  // Return the timing, falling back where a token could not be read
  return {
    duration: Number.isNaN(duration) ? FALLBACK_SETTLE_DURATION : duration,
    easing: easing || FALLBACK_SETTLE_EASING,
  };
}
