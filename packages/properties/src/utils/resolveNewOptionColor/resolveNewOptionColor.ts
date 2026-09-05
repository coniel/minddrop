import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { SelectPropertyOption } from '../../schemas';

/**
 * Resolves the colour for a new select option, picking a random
 * colour and preferring ones no existing option uses yet.
 *
 * @param options - The property's existing options.
 * @returns The new option's colour.
 */
export function resolveNewOptionColor(
  options: SelectPropertyOption[],
): ContentColor {
  // Prefer colours no option uses yet
  const usedColors = new Set(options.map((option) => option.color));
  const unusedColors = ContentColors.filter((color) => !usedColors.has(color));
  const pool = unusedColors.length > 0 ? unusedColors : ContentColors;

  return pool[Math.floor(Math.random() * pool.length)];
}
