import { useCallback } from 'react';
import {
  useActiveLayoutType,
  useDesignStudio,
  useElement,
} from '../DesignStudioStore';
import { getRoleEditableStyleKeys, getRoleLockedStyleKeys } from '../utils';
import { SpaceSide } from './SpaceFields';

export interface StyleEditor {
  /**
   * The element's own style, before its role's styles are applied.
   * Editors show what the user set, not the resolved result.
   */
  style: Record<string, unknown>;

  /**
   * Whether a style key is editable, meaning the element's role
   * does not control it.
   */
  isEditable: (key: string) => boolean;

  /**
   * Reads a style value, typed by the caller.
   */
  getValue: <TValue>(key: string) => TValue | undefined;

  /**
   * Writes a style value, clearing the key when the value is
   * undefined.
   */
  setValue: (key: string, value: unknown) => void;

  /**
   * Filters a set of spacing sides down to the editable ones.
   */
  editableSides: (sides: SpaceSide[]) => SpaceSide[];
}

/**
 * Binds an element's style to the studio store for the style
 * editors, hiding every key its design role controls: keys the
 * role locks, and keys outside the role's editable styles list.
 * Suppressed keys render no field at all, so a role's look cannot
 * be contradicted from the panel.
 *
 * @param elementId - The ID of the element being edited.
 * @returns The style editing helpers.
 */
export function useStyleEditor(elementId: string): StyleEditor {
  const studio = useDesignStudio();
  const element = useElement(elementId);
  // The editor edits the active layout, whose type role styles
  // resolve against
  const layoutType = useActiveLayoutType();

  // The keys the element's role locks, recomputed as the element
  // or its variant selection changes
  const lockedKeys = getRoleLockedStyleKeys(element, layoutType ?? undefined);

  // The keys the role offers for editing, null when unrestricted
  const editableKeys = getRoleEditableStyleKeys(element);

  const style = element.style as Record<string, unknown>;

  const isEditable = useCallback(
    (key: string) =>
      !lockedKeys.has(key) && (!editableKeys || editableKeys.includes(key)),
    [lockedKeys, editableKeys],
  );

  const getValue = useCallback(
    <TValue>(key: string) => style[key] as TValue | undefined,
    [style],
  );

  const setValue = useCallback(
    (key: string, value: unknown) => {
      // The store deletes the key when the value is undefined, so
      // cleared fields emit no CSS
      studio.updateElementStyle(
        elementId,
        key as Parameters<typeof studio.updateElementStyle>[1],
        value as never,
      );
    },
    [studio, elementId],
  );

  const editableSides = useCallback(
    (sides: SpaceSide[]) => sides.filter((side) => isEditable(side.key)),
    [isEditable],
  );

  return { style, isEditable, getValue, setValue, editableSides };
}
