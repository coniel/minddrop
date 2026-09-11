import { ColorLevel, ContentColor } from '../../types';

/**
 * The ramp the default colour draws from. Schemes rebind this to
 * their own hue. Neutral outside a scheme.
 */
const DefaultColorRamp = 'accent';

/**
 * Resolves a step of a content colour's ramp to the palette token
 * holding it.
 *
 * @param color - The content colour.
 * @param level - The step of the colour's ramp.
 * @returns The CSS colour value.
 */
export function resolveColorLevel(
  color: ContentColor,
  level: ColorLevel,
): string {
  const ramp = color === 'default' ? DefaultColorRamp : color;

  return `var(--${ramp}-${level})`;
}
