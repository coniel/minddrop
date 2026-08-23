import { PropertyType } from '@minddrop/properties';
import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { DateFormat } from './date';
import { NumberFormat } from './number';

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

/**
 * A property element rendering a number property.
 */
export interface NumberPropertyElement extends PropertyElementBase {
  propertyType: 'number';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Number formatting options.
   */
  format?: NumberFormat;
}

/**
 * A property element rendering a date property.
 */
export interface DatePropertyElement extends PropertyElementBase {
  propertyType: 'date';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Date formatting options.
   */
  format?: DateFormat;
}

/**
 * Union of all property element shapes, discriminated by the
 * property type.
 */
export type PropertyElement =
  | TextPropertyElement
  | NumberPropertyElement
  | DatePropertyElement;

// The 'property' element type's generic config. Palette identity,
// property compatibility and styling all resolve through the
// per-property-type PropertyElementConfig registry instead, so
// this config only carries what generic element machinery reads.
// Omits a palette group: the palette lists property elements
// through their property element configs.
export const PropertyElementTypeConfig: DesignElementConfig<PropertyElement> = {
  type: 'property',
  icon: 'diamond',
  label: 'design-studio.elements.property',
  // Property elements render typography unless their selected
  // variant's style category says otherwise
  styleCategory: 'typography',
  // Compatibility comes from the property element config's
  // bindsPropertyTypes, resolved via getElementCompatiblePropertyTypes
  compatiblePropertyTypes: [],
  // Property elements are purely property-based
  supportsStaticContent: false,
  emptyBehavior: 'hide',
  template: {
    type: 'property',
    propertyType: 'text',
    style: {},
  },
};
