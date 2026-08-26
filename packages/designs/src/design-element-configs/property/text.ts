import { TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a text property.
 */
export interface TextPropertyElement extends PropertyElementBase {
  propertyType: 'text';

  /**
   * The element style.
   */
  style: TypographyStyle;
}
