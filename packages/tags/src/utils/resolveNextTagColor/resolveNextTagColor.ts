import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { TagsStore } from '../../TagsStore';

/**
 * Returns the default color for the next created tag, rotating
 * through the content colors based on the current tag count.
 *
 * @returns The next tag color.
 */
export function resolveNextTagColor(): ContentColor {
  // Rotate through the content colors, excluding 'default'
  const colors = ContentColors.filter((color) => color !== 'default');

  return colors[TagsStore.getAllArray().length % colors.length];
}
