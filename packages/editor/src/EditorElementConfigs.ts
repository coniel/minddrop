/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HeadingElementConfig,
  ParagraphElementConfig,
} from './default-element-configs';
import { EditorBlockElementConfig } from './types';

/**
 * The editor components for the markdown element types.
 *
 * The element set is decided by markdown rather than at runtime, so the
 * configs are static.
 */
export const EditorElementConfigs: EditorBlockElementConfig<any>[] = [
  HeadingElementConfig,
  ParagraphElementConfig,
];

/**
 * Retrieves the editor config for an element type.
 *
 * @param type - The element type.
 * @returns The editor element config, or null if the type has no component.
 */
export function getEditorElementConfig(
  type: string,
): EditorBlockElementConfig | null {
  return EditorElementConfigs.find((config) => config.type === type) || null;
}
