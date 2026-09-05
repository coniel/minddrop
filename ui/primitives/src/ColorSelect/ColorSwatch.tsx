import { ContentColor } from '@minddrop/ui-theme';
import './ColorSelect.css';

export interface ColorSwatchProps {
  /*
   * The content colour the swatch shows.
   * @default 'default'
   */
  color?: ContentColor;

  /*
   * Class name applied to the swatch element.
   */
  className?: string;
}

/**
 * Renders a small round swatch showing a content colour, for use
 * in colour picking triggers outside the ColorSelect itself.
 */
export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color = 'default',
  className,
}) => (
  <span
    className={`color-select-swatch color-select-swatch-${color} ${className ?? ''}`.trim()}
  />
);
