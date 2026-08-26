import { TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a title property.
 */
export interface TitlePropertyElement extends PropertyElementBase {
  propertyType: 'title';

  /**
   * The element style.
   */
  style: TypographyStyle;
}
