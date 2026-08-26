import { BadgeStyle, TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a select property. The style shape
 * follows the selected variant: chips take the badge style, the
 * plain text presentation typography.
 */
export interface SelectPropertyElement extends PropertyElementBase {
  propertyType: 'select';

  /**
   * The element style.
   */
  style: BadgeStyle | TypographyStyle;
}
