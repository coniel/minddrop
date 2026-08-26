import { FieldStyle, TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a text property. The style shape
 * follows the selected variant: the display presentations take
 * typography, the field editors the field style.
 */
export interface TextPropertyElement extends PropertyElementBase {
  propertyType: 'text';

  /**
   * The element style.
   */
  style: TypographyStyle | FieldStyle;
}
