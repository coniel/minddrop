import { createRoleElement } from '@minddrop/designs';
import { DesignStudioStore } from '../DesignStudioStore';
import { FlatDesignElement } from '../types';
import { isStudioRootPanelled } from '../utils';

/**
 * Inserts a new element playing the given role into a layout,
 * auto-bound to the first compatible unbound design property, and
 * selects it. Does nothing when the role's layout or design cannot
 * be resolved.
 *
 * @param studio - The design studio store instance.
 * @param roleId - The ID of the role to instantiate.
 * @param parentId - The ID of the parent element to insert into.
 * @param index - The index to insert the element at.
 * @param layoutId - The ID of the layout to insert into. Falls back to the active layout when omitted.
 */
export function insertRoleElement(
  studio: DesignStudioStore,
  roleId: string,
  parentId: string,
  index: number,
  layoutId?: string,
): void {
  const design = studio.getDesign();

  // Roles are instantiated against the design being edited
  if (!design) {
    return;
  }

  // Fall back to the active layout when no layout is given
  const resolvedLayoutId = layoutId ?? studio.getActiveLayoutId();

  // Auto-binding needs the layout's existing bindings, taken from
  // the live elements so that properties bound since the last save
  // are already counted as taken
  const layout = studio.getLiveLayout(resolvedLayoutId ?? undefined);

  if (!layout) {
    return;
  }

  // New elements can't be dropped into the panel row itself
  if (parentId === 'root' && isStudioRootPanelled(studio, resolvedLayoutId)) {
    return;
  }

  // Instantiate the role's element type, auto-bound to a compatible
  // unbound property
  const element = createRoleElement(roleId, design, layout);

  // Flatten the new element for the studio's element map. Newly
  // created container elements are always empty.
  const flatElement = {
    ...element,
    parent: parentId,
    ...('children' in element && { children: [] }),
  } as FlatDesignElement;

  studio.addElement(flatElement, parentId, index, layoutId);
  studio.selectElement(flatElement.id, layoutId);
  studio.saveDesign();
}
