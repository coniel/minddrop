import { CanvasConnectionStyle } from '../../types';

/**
 * Returns the SVG stroke dash array for a connection stroke
 * style, scaled with the stroke width so dashes and dots keep
 * their proportions across thicknesses. Solid strokes return
 * undefined.
 *
 * @param style - The connection's stroke style.
 * @param strokeWidth - The connection's stroke width.
 * @returns The dash array value, or undefined for solid strokes.
 */
export function getConnectionDasharray(
  style: CanvasConnectionStyle | undefined,
  strokeWidth: number,
): string | undefined {
  // Dashes scale with the stroke width
  if (style === 'dashed') {
    return `${strokeWidth * 4} ${strokeWidth * 3}`;
  }

  // Dots are zero-length dashes rounded into circles by the
  // stroke's round line cap
  if (style === 'dotted') {
    return `0.1 ${strokeWidth * 2.5}`;
  }

  return undefined;
}
