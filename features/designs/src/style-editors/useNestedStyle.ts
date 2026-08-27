import { useCallback, useRef } from 'react';
import { StyleEditor } from './useStyleEditor';

export interface NestedStyleEditor {
  /**
   * The nested style object, undefined while unset.
   */
  value: Record<string, unknown> | undefined;

  /**
   * Whether the nested style is editable. The style nests as a
   * single element key, so a variant either offers the whole
   * object or none of it.
   */
  isEditable: (key: string) => boolean;

  /**
   * Reads a key of the nested style.
   */
  getValue: <TValue>(key: string) => TValue | undefined;

  /**
   * Writes a key of the nested style, clearing it when the value
   * is undefined and dropping the object once none of its values
   * remain set.
   */
  setValue: (key: string, value: unknown) => void;
}

/**
 * Binds a nested object style key (e.g. the editor's title
 * typography or a property element's label) to the get/set shape
 * the style fields work against.
 *
 * @param editor - The element's style editing helpers.
 * @param key - The element style key the object nests under.
 * @returns The nested style editing helpers.
 */
export function useNestedStyle(
  editor: StyleEditor,
  key: string,
): NestedStyleEditor {
  const {
    isEditable: isKeyEditable,
    getValue: getStyleValue,
    setValue: setStyleValue,
  } = editor;

  const value = getStyleValue<Record<string, unknown>>(key);

  // Tracks the latest written object so back-to-back writes in a
  // single event (e.g. a section clear unsetting every key) build
  // on each other rather than on the render's stale value
  const valueRef = useRef(value);

  valueRef.current = value;

  // The nested style is a single key on the element, so a variant
  // either controls the whole object or none of it
  const isEditable = useCallback(
    () => isKeyEditable(key),
    [isKeyEditable, key],
  );

  // Read a single key of the nested style
  const getValue = useCallback(
    <TValue>(nestedKey: string) => value?.[nestedKey] as TValue | undefined,
    [value],
  );

  // Write a single key of the nested style, dropping the object
  // entirely once none of its values remain set
  const setValue = useCallback(
    (nestedKey: string, nestedValue: unknown) => {
      const next: Record<string, unknown> = { ...valueRef.current };

      // Remove keys the user cleared so the object does not linger
      // empty
      if (nestedValue === undefined) {
        delete next[nestedKey];
      } else {
        next[nestedKey] = nestedValue;
      }

      const hasValues = Object.keys(next).length > 0;

      valueRef.current = hasValues ? next : undefined;
      setStyleValue(key, hasValues ? next : undefined);
    },
    [key, setStyleValue],
  );

  return { value, isEditable, getValue, setValue };
}
