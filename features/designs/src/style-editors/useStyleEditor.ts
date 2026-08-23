import { useCallback } from 'react';
import { resolveElementStyle } from '@minddrop/designs';
import {
  useActiveLayoutType,
  useDesignStudio,
  useElement,
} from '../DesignStudioStore';
import {
  getElementEditableStyleKeys,
  getElementLockedStyleKeys,
} from '../utils';
import { SpaceSide } from './SpaceFields';

export interface StyleEditor {
  /**
   * The element's own style, before its role or variant styles are
   * applied. Editors show what the user set, not the resolved
   * result.
   */
  style: Record<string, unknown>;

  /**
   * Whether a style key is editable, meaning neither the element's
   * role nor its variant controls it.
   */
  isEditable: (key: string) => boolean;

  /**
   * Reads a style value, typed by the caller.
   */
  getValue: <TValue>(key: string) => TValue | undefined;

  /**
   * Reads a style key's effective value: the element's own,
   * falling back to what its role or variant theme styles resolve
   * to. For fields whose control should reflect the rendered
   * default rather than sitting unset.
   */
  getResolvedValue: <TValue>(key: string) => TValue | undefined;

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
 * editors, hiding every key its design role or property element
 * variant controls: locked keys, and keys outside the editable
 * styles list. Suppressed keys render no field at all, so a
 * controlled look cannot be contradicted from the panel.
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

  // The keys the element's role or variant locks, recomputed as
  // the element or its variant selection changes
  const lockedKeys = getElementLockedStyleKeys(
    element,
    layoutType ?? undefined,
  );

  // The keys offered for editing, null when unrestricted
  const editableKeys = getElementEditableStyleKeys(element);

  const style = element.style as Record<string, unknown>;

  // The effective style, with the role or variant theme styles
  // resolved over the element's own
  const resolvedStyle = resolveElementStyle(
    element,
    layoutType ?? undefined,
  ) as Record<string, unknown>;

  const isEditable = useCallback(
    (key: string) =>
      !lockedKeys.has(key) && (!editableKeys || editableKeys.includes(key)),
    [lockedKeys, editableKeys],
  );

  const getValue = useCallback(
    <TValue>(key: string) => style[key] as TValue | undefined,
    [style],
  );

  const getResolvedValue = useCallback(
    <TValue>(key: string) => resolvedStyle[key] as TValue | undefined,
    [resolvedStyle],
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

  return {
    style,
    isEditable,
    getValue,
    getResolvedValue,
    setValue,
    editableSides,
  };
}
