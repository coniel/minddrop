import { Fragment } from '../types';

/**
 * Stringifies an array of text and inline elements
 * into a markdown formatted string.
 *
 * @param fragment - The fragment to stringify.
 * @returns The stringified markdown fragment.
 */
export function stringifyFragmentToMarkdown(fragment: Fragment): string {
  let result = '';

  for (const child of fragment) {
    if ('text' in child) {
      result += child.text;
    } else if ('children' in child) {
      result += stringifyFragmentToMarkdown(child.children || []);
    }
  }

  return result;
}
