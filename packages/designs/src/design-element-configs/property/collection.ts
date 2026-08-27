import { EmbedStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a collection property as an
 * embedded data view. The selected variant is the view type the
 * bound view renders as.
 */
export interface CollectionPropertyElement extends PropertyElementBase {
  propertyType: 'collection';

  /**
   * The element style.
   */
  style: EmbedStyle;
}
