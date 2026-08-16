/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BreakElementConfig,
  CodeElementConfig,
  DefinitionElementConfig,
  FootnoteReferenceElementConfig,
  HeadingElementConfig,
  HtmlElementConfig,
  ImageElementConfig,
  ImageReferenceElementConfig,
  InlineHtmlElementConfig,
  InlineMathElementConfig,
  LinkElementConfig,
  LinkReferenceElementConfig,
  MathElementConfig,
  ParagraphElementConfig,
  ThematicBreakElementConfig,
  UnsupportedElementConfig,
  WikilinkElementConfig,
} from './default-element-configs';
import { EditorBlockElementConfig } from './types';

/**
 * The editor components for the markdown element types.
 *
 * The element set is decided by markdown rather than at runtime, so the
 * configs are static.
 */
export const EditorElementConfigs: EditorBlockElementConfig<any>[] = [
  // Blocks
  CodeElementConfig,
  DefinitionElementConfig,
  HeadingElementConfig,
  HtmlElementConfig,
  MathElementConfig,
  ParagraphElementConfig,
  ThematicBreakElementConfig,
  UnsupportedElementConfig,
  // Inlines
  BreakElementConfig,
  FootnoteReferenceElementConfig,
  ImageElementConfig,
  ImageReferenceElementConfig,
  InlineHtmlElementConfig,
  InlineMathElementConfig,
  LinkElementConfig,
  LinkReferenceElementConfig,
  WikilinkElementConfig,
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
