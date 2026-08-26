import { PropertyType } from '@minddrop/properties';
import { DesignElementBase } from '../../types';

/**
 * Base interface shared by all property elements: elements
 * rendering a bound property, where the selected presentation
 * variant determines the renderer. Purely property-based, so no
 * static content mode.
 */
export interface PropertyElementBase extends DesignElementBase {
  type: 'property';

  /**
   * The property type the element renders. Persisted so an
   * unbound element keeps rendering and styling as its type.
   */
  propertyType: PropertyType;

  /**
   * The element's selected presentation variant. Omitted or set to
   * an unknown variant, the config's default applies.
   */
  variant?: string;
}
