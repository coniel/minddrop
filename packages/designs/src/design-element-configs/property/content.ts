import { EditorStyle, TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering a content property. The
 * style shape follows the selected variant: the static display
 * takes typography, the editor the editor style.
 */
export interface ContentPropertyElement extends PropertyElementBase {
  propertyType: 'content';

  /**
   * The element style.
   */
  style: TypographyStyle | EditorStyle;

  /**
   * The design property rendered as the editor variant's title
   * block. Only 'title' and 'text' type properties are valid
   * targets.
   */
  titleProperty?: string;
}
