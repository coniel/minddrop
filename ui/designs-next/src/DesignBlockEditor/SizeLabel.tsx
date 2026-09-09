import { formatSnapUnits, resolveSizeLabelFontSize } from '../utils';
import './SizeLabel.css';

export interface SizeLabelProps {
  /**
   * The width being read out, in grid units.
   */
  columnSpan: number;

  /**
   * The height being read out, in grid units.
   */
  rowSpan: number;

  /**
   * The snap resolution in grid units, the unit the size reads in.
   */
  snap: number;

  /**
   * The rendered pixel size of a grid unit.
   */
  unitSize: number;
}

/**
 * Renders a size in snap units, centered on the box it fills. Hands
 * the stylesheet the size the label fits the box at, which it holds
 * the type under.
 */
export const SizeLabel: React.FC<SizeLabelProps> = ({
  columnSpan,
  rowSpan,
  snap,
  unitSize,
}) => {
  const label = `${formatSnapUnits(columnSpan, snap)} × ${formatSnapUnits(rowSpan, snap)}`;

  return (
    <div
      className="design-block-editor-size-label"
      style={
        {
          // The fitting size in the surface's own coordinate space,
          // which the canvas zoom scales
          '--design-block-editor-size-label-fit': `${resolveSizeLabelFontSize(
            label,
            columnSpan * unitSize,
            rowSpan * unitSize,
          )}px`,
        } as React.CSSProperties
      }
    >
      {label}
    </div>
  );
};
