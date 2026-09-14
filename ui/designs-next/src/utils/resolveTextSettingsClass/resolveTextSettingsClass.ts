import { DesignElement, TextSettings } from '@minddrop/designs-next';
import './design-element-text.css';

/**
 * Resolves the modifier classes for an element's text settings.
 *
 * @param element - The element carrying the text settings.
 * @returns The space-separated modifier classes, empty when no
 *   setting is active.
 */
export function resolveTextSettingsClass(
  element: DesignElement & TextSettings,
): string {
  const classes: string[] = [];

  // Text set in a family other than sans, which the elements are
  // already set in.
  if (element.fontFamily && element.fontFamily !== 'sans') {
    classes.push(`design-element-text-family-${element.fontFamily}`);
  }

  // Italic text
  if (element.italic) {
    classes.push('design-element-text-italic');
  }

  // Underlined text
  if (element.underline) {
    classes.push('design-element-text-underline');
  }

  // Struck through text
  if (element.strikethrough) {
    classes.push('design-element-text-strikethrough');
  }

  // Text lined up on an edge other than the left one
  if (element.textAlign && element.textAlign !== 'left') {
    classes.push(`design-element-text-align-${element.textAlign}`);
  }

  // Text sitting against an edge other than the top one
  if (element.verticalAlign && element.verticalAlign !== 'top') {
    classes.push(`design-element-text-vertical-align-${element.verticalAlign}`);
  }

  return classes.join(' ');
}
