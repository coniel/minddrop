import { DroppablesRegistry } from '../../DroppablesRegistry';
import { ActiveDrag, DropTarget } from '../../types';
import { resolveDropPosition } from '../resolveDropPosition';

/**
 * Resolves the drop targets under an element, innermost first. A
 * target accepting none of the drag's types is skipped, as is a
 * direct only target when the element is one of its descendants.
 * Nothing outside a target which claims the drag is resolved.
 *
 * @param hitElement - The element under the pointer.
 * @param drag - The drag in progress.
 * @param clientX - The horizontal position of the pointer in the viewport.
 * @param clientY - The vertical position of the pointer in the viewport.
 * @returns The drop targets, innermost first.
 */
export function resolveDropTargets(
  hitElement: Element,
  drag: ActiveDrag,
  clientX: number,
  clientY: number,
): DropTarget[] {
  // The resolved targets, innermost first
  const targets: DropTarget[] = [];

  // Start from the innermost drop target element
  let element = hitElement.closest('[data-droppable-key]');

  // Walk the drop target elements outwards
  while (element) {
    // Look up the target registered for the element, and the next
    // drop target element outwards.
    const key = element.getAttribute('data-droppable-key') ?? '';
    const entry = DroppablesRegistry.get(key);
    const next = element.parentElement?.closest('[data-droppable-key]') ?? null;

    // Skip the element if its target has unregistered since it was hit
    if (!entry) {
      element = next;

      continue;
    }

    // Check whether the target accepts the drag, and whether the
    // pointer is over its own empty space when it is direct only.
    const options = entry.options.current;
    const accepted =
      !options.accepts ||
      options.accepts.some((type) => drag.types.includes(type));
    const direct = !options.directOnly || element === hitElement;

    // Skip a target which accepts none of the drag's types, or is
    // direct only and hit through a descendant.
    if (!accepted || !direct) {
      element = next;

      continue;
    }

    // Add the target with the pointer's position relative to it
    targets.push({
      entry,
      position: resolveDropPosition(
        entry.element.getBoundingClientRect(),
        clientX,
        clientY,
        options,
      ),
    });

    // Stop at a target which claims the drag. Targets claim it unless
    // they opt out.
    if (options.claim !== false) {
      break;
    }

    // Move to the next drop target element outwards
    element = next;
  }

  return targets;
}
