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

  // Bold text
  if (element.bold) {
    classes.push('design-element-text-bold');
  }

  // Italic text
  if (element.italic) {
    classes.push('design-element-text-italic');
  }

  return classes.join(' ');
}
