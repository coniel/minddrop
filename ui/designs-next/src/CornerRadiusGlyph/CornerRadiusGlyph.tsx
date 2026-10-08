import { ElementCornerRadius } from '@minddrop/designs-next';
import './CornerRadiusGlyph.css';

export interface CornerRadiusGlyphProps {
  /**
   * The corner radius the glyph draws.
   */
  radius: ElementCornerRadius;
}

// The glyph's square drawing box
const GlyphSize = 16;

// How far the drawn corner sits inside the box
const GlyphInset = 2;

// The curve each radius draws, in the box's units
const GlyphCurves: Record<ElementCornerRadius, number> = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  full: 8,
};

/**
 * Renders a corner radius as a drawn corner.
 */
export const CornerRadiusGlyph: React.FC<CornerRadiusGlyphProps> = ({
  radius,
}) => (
  <svg
    viewBox={`0 0 ${GlyphSize} ${GlyphSize}`}
    className="icon design-element-corner-radius-glyph"
    aria-hidden="true"
  >
    <path
      d={resolveCornerPath(GlyphCurves[radius])}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Builds the path of a corner curved by the given amount: up the
 * left edge, around the corner, and along the top.
 *
 * @param curve - The corner's radius in the glyph's units.
 * @returns The path data.
 */
function resolveCornerPath(curve: number): string {
  // The corner's near and far edges
  const near = GlyphInset;
  const far = GlyphSize - GlyphInset;

  // Draw a square corner when there is no curve
  if (!curve) {
    return `M${near} ${far} V${near} H${far}`;
  }

  // Draw the curved corner
  return `M${near} ${far} V${near + curve} A${curve} ${curve} 0 0 1 ${
    near + curve
  } ${near} H${far}`;
}
