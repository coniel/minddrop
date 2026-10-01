import { WikilinkElement } from '../../element-configs';
import { generateElement } from '../generateElement';
import { resolveWikilinkTarget } from '../resolveWikilinkTarget';

export interface GenerateWikilinkElementOptions {
  /**
   * The link's text. Defaults to the link's target.
   */
  label?: string;

  /**
   * The part of the target the link points into.
   */
  fragment?: string;
}

/**
 * Builds a wikilink element. A link without a label shows its target
 * as its text.
 *
 * @param reference - What the link points at, as written between its brackets.
 * @param options - The link's text and the part of the target it points into.
 * @returns The wikilink element.
 */
export function generateWikilinkElement(
  reference: string,
  options: GenerateWikilinkElementOptions = {},
): WikilinkElement {
  const { label, fragment } = options;

  return generateElement<WikilinkElement>('wikilink', {
    // The reference
    reference,
    // The fragment, when the link has one
    ...(fragment ? { fragment } : {}),
    // The label, or the target when there is none
    children: [{ text: label ?? resolveWikilinkTarget(reference, fragment) }],
  });
}
