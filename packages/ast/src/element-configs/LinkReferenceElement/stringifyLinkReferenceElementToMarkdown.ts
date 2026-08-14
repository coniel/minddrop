import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { LinkReferenceElement } from './LinkReferenceElement.types';

/**
 * Stringifies a link reference element into markdown.
 *
 * @param element - The link reference element to stringify.
 * @returns A markdown link reference string.
 */
export const stringifyLinkReferenceElementToMarkdown = (
  element: LinkReferenceElement,
): string => {
  const text = stringifyFragmentToMarkdown(element.children);

  // A shortcut reference is just the label, with no second bracket pair
  if (element.referenceType === 'shortcut') {
    return `[${text}]`;
  }

  // A collapsed reference uses the text as its own label
  if (element.referenceType === 'collapsed') {
    return `[${text}][]`;
  }

  return `[${text}][${element.label || element.identifier}]`;
};
