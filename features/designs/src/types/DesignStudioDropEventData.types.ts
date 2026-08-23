import {
  DesignElementTemplate,
  DesignRoleId,
  LayoutType,
} from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { FlatChildDesignElement } from './FlatDesignElement.types';

/**
 * The payload of a design role dragged from the elements palette.
 * Carries the role ID rather than an element template, so the drop
 * instantiates the role through the core package.
 */
export interface DesignRoleDragData {
  /**
   * The ID of the dragged design role.
   */
  roleId: DesignRoleId;
}

/**
 * The payload of a property element dragged from the elements
 * palette. Carries the property type rather than an element
 * template, so the drop instantiates the element dynamically.
 */
export interface PropertyElementDragData {
  /**
   * The property type of the dragged property element.
   */
  propertyType: PropertyType;
}

/**
 * The payload of a layout type dragged from the layouts panel onto
 * the canvas, which creates a layout of that type at the drop point.
 */
export interface DesignLayoutTypeDragData {
  /**
   * The type of layout to create.
   */
  layoutType: LayoutType;
}

export interface DesignStudioDropEventData {
  'design-element-templates'?: DesignElementTemplate[];
  'design-elements'?: FlatChildDesignElement[];
  'design-roles'?: DesignRoleDragData[];
  'design-property-elements'?: PropertyElementDragData[];
  'design-layout-types'?: DesignLayoutTypeDragData[];
}
