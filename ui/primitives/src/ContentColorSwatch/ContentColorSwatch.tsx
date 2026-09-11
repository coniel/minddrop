import {
  ColorLevel,
  ContentColor,
  resolveColorLevel,
} from '@minddrop/ui-theme';
import { propsToClass } from '../utils';
import './ContentColorSwatch.css';

export type ContentColorSwatchSize = 'xs' | 'sm' | 'md';

export interface ContentColorSwatchProps {
  /**
   * The colour's hue.
   */
  color: ContentColor;

  /**
   * The step of the hue's ramp the swatch is drawn at.
   * @default 900
   */
  level?: ColorLevel;

  /**
   * Size of the swatch.
   * @default 'md'
   */
  size?: ContentColorSwatchSize;

  /**
   * Draws the swatch struck through, for the option leaving a
   * colour unset rather than picking one.
   */
  unset?: boolean;

  /**
   * Class name applied to the swatch.
   */
  className?: string;
}

/**
 * The step a colour is shown at unless another is asked for. The
 * most saturated step of its ramp.
 */
const DefaultSwatchLevel: ColorLevel = 900;

/**
 * Renders a content colour as a round swatch, filled edge to edge.
 * Stands in for an icon on the controls which pick a colour.
 *
 * The option which leaves a colour unset takes a struck-through
 * swatch instead. It stands for no colour, not for a pale one.
 */
export const ContentColorSwatch: React.FC<ContentColorSwatchProps> = ({
  color,
  level = DefaultSwatchLevel,
  size = 'md',
  unset,
  className,
}) => (
  <span
    className={propsToClass('content-color-swatch', { size, unset, className })}
    // A struck-through swatch stands for no colour at all, so it
    // is drawn in the neutral the stylesheet strikes it in.
    style={unset ? undefined : { background: resolveColorLevel(color, level) }}
  />
);
