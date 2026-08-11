import { ContentColor } from '@minddrop/ui-theme';
import {
  CanvasConnectionArrows,
  CanvasConnectionShape,
  CanvasConnectionStyle,
  CanvasConnectionStyleDefaults,
  CanvasConnectionThickness,
} from '../../types';

/**
 * A connection's styling with the package defaults filled in.
 */
export interface ResolvedConnectionStyle {
  /**
   * Which ends are drawn with an arrowhead.
   */
  arrows: CanvasConnectionArrows;

  /**
   * The path geometry the curve is drawn with, left to the path
   * builder's default when unset.
   */
  shape: CanvasConnectionShape | undefined;

  /**
   * The curve's stroke color.
   */
  color: ContentColor;

  /**
   * The curve's stroke style, solid when unset.
   */
  style: CanvasConnectionStyle | undefined;

  /**
   * The curve's stroke thickness.
   */
  thickness: CanvasConnectionThickness;
}

/**
 * Resolves a curve's styling from the given sources, taking each
 * value from the first source which sets it and falling back to
 * the package defaults.
 *
 * @param sources - The style sources, in order of precedence.
 * @returns The resolved styling.
 */
export function resolveConnectionStyle(
  sources: (CanvasConnectionStyleDefaults | undefined)[],
): ResolvedConnectionStyle {
  return {
    arrows: resolveValue(sources, 'arrows') ?? 'end',
    shape: resolveValue(sources, 'shape'),
    color: resolveValue(sources, 'color') ?? 'default',
    style: resolveValue(sources, 'style'),
    thickness: resolveValue(sources, 'thickness') ?? 'medium',
  };
}

/**
 * Returns a style value from the first source which sets it.
 */
function resolveValue<Key extends keyof CanvasConnectionStyleDefaults>(
  sources: (CanvasConnectionStyleDefaults | undefined)[],
  key: Key,
): CanvasConnectionStyleDefaults[Key] {
  const source = sources.find((candidate) => candidate?.[key] !== undefined);

  return source?.[key];
}
