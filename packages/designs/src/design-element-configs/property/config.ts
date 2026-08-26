import { DesignElementConfig } from '../../types';
import { PropertyElement } from './PropertyElement.types';

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
