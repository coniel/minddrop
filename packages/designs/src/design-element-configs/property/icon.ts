import { IconStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering an icon property.
 */
export interface IconPropertyElement extends PropertyElementBase {
  propertyType: 'icon';

  /**
   * The element style.
   */
  style: IconStyle;
}
