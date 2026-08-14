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
  TableCellElementConfig,
  TableElementConfig,
  TableRowElementConfig,
  ThematicBreakElementConfig,
} from './element-configs';
import { ElementTypeConfig } from './types';

// The configs import this module back: serializing a link's text runs
// through the fragment serializer, which looks element types up here. In
// that cycle a config can still be uninitialized while this module
// evaluates, and a list built at module scope would capture it as
// undefined for good. Building it on first call instead waits until every
// module has finished evaluating.
let configs: ElementTypeConfig[] | null = null;

/**
 * Returns every element type the markdown model supports, one per mdast
 * node type.
 *
 * The set is fixed at build time: markdown decides which elements exist, so
 * there is nothing to register at runtime.
 *
 * @returns The element type configs.
 */
export function getElementTypeConfigs(): ElementTypeConfig[] {
  if (!configs) {
    configs = [
      // Block elements
      CodeElementConfig,
      DefinitionElementConfig,
      HeadingElementConfig,
      HtmlElementConfig,
      MathElementConfig,
      ParagraphElementConfig,
      TableElementConfig,
      TableRowElementConfig,
      TableCellElementConfig,
      ThematicBreakElementConfig,

      // Inline elements
      BreakElementConfig,
      FootnoteReferenceElementConfig,
      ImageElementConfig,
      ImageReferenceElementConfig,
      InlineHtmlElementConfig,
      InlineMathElementConfig,
      LinkElementConfig,
      LinkReferenceElementConfig,
    ];
  }

  return configs;
}

/**
 * Retrieves the configuration for an element type.
 *
 * @param type - The element type.
 * @returns The element type configuration, or null if the type is unknown.
 */
export function getElementTypeConfig(type: string): ElementTypeConfig | null {
  return getElementTypeConfigs().find((config) => config.type === type) || null;
}
