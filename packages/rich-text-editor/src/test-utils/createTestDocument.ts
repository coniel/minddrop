import { initializeCore } from '@minddrop/core';
import {
  RichTextBlockElement,
  RichTextDocuments,
  RichTextElementConfig,
  RichTextElements,
} from '@minddrop/rich-text';

const core = initializeCore({ appId: 'app', extensionId: 'app' });

/**
 * Creates a rich text document after first registering
 * the provided element type configs and loading the
 * given elements.
 *
 * If the `children` parameter is omited, the elements
 * are treated as the document's root level elements.
 *
 * @param configs The configs of the elements types contained by the document.
 * @param elements The elements making up the content of the document.
 * @param children The document's `children` value.
 * @returns A rich text document.
 */
export function createTestDocument(
  configs: RichTextElementConfig[],
  elements: RichTextBlockElement[],
  children?: string[],
) {
  // Register the configs
  configs.forEach((config) => {
    RichTextElements.register(core, config);
  });

  // Load the test elements
  RichTextElements.load(core, elements);

  // Create a test document
  const document = RichTextDocuments.create(core, {
    children: children || elements.map((element) => element.id),
  });

  return document;
}
