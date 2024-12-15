import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { Element } from '../types';

/**
 * Stringifies an array of elements to markdown.
 *
 * @param elementConfigs - The element type configs to use for stringification.
 * @param elements - The elements to stringify.
 * @returns The markdown string.
 */
export function stringifyElementsToMarkdown(
  elements: Element[],
  elementConfigs = ElementTypeConfigsStore.getAll(),
): string {
  let index = 0;
  let currentElement = elements[index];
  const markdown: string[] = [];

  function setCurrentElement() {
    currentElement = elements[index];
  }

  if (!currentElement) {
    return '';
  }

  while (currentElement) {
    const config = elementConfigs.find((c) => c.type === currentElement.type);
    const next = elements[index + 1];

    // If no matching config is found, we have no way to stringify the element,
    // so we skip it.
    if (!config) {
      index += 1;
      continue;
    }

    // If the next element is of the same type and a `stringifyBatch` function is provided,
    // stringify the current element and all subsequent elements of the same type as a batch.
    if (
      next &&
      next.type === currentElement.type &&
      config.stringifyBatchToMarkdown
    ) {
      const batch = [currentElement, next];
      index += 2;

      while (elements[index]?.type === currentElement.type) {
        batch.push(elements[index]);
        index += 1;
      }

      markdown.push(config.stringifyBatchToMarkdown(batch));
      setCurrentElement();
      continue;
    }

    // Otherwise, stringify the current element.
    markdown.push(config.toMarkdown(currentElement));
    index += 1;

    setCurrentElement();
  }

  return markdown.join('\n\n');
}
