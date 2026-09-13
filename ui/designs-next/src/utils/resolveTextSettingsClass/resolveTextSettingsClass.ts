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

  // Italic text
  if (element.italic) {
    classes.push('design-element-text-italic');
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
