import { PropertySchema } from '@minddrop/properties';
import { Design, Layout } from './types';

// Typed as plain strings: the designs package registers these same
// event names in the event data registry with its own data types, so
// keeping the literal types here would type call sites with the wrong
// data in programs which include both packages
export const DesignCreatedEvent: string = 'designs:design:created';
export const DesignDeletedEvent: string = 'designs:design:deleted';
export const DesignUpdatedEvent: string = 'designs:design:updated';

export type DesignCreatedEventData = Design;
export type DesignDeletedEventData = Design;
export type DesignUpdatedEventData = {
  original: Design;
  updated: Design;
};

export const DesignPropertyAddedEvent = 'designs:property:added';
export const DesignPropertyUpdatedEvent = 'designs:property:updated';
export const DesignPropertyRemovedEvent = 'designs:property:removed';
// Plain string for the same reason as the design events above
export const DesignPropertyRenamedEvent: string = 'designs:property:renamed';

export interface DesignPropertyAddedEventData {
  /**
   * The design the property was added to.
   */
  design: Design;

  /**
   * The property that was added.
   */
  property: PropertySchema;
}

export interface DesignPropertyUpdatedEventData {
  /**
   * The design the property belongs to.
   */
  design: Design;

  /**
   * The updated property.
   */
  property: PropertySchema;
}

export interface DesignPropertyRemovedEventData {
  /**
   * The design the property was removed from.
   */
  design: Design;

  /**
   * The property that was removed.
   */
  property: PropertySchema;
}

export interface DesignPropertyRenamedEventData {
  /**
   * The design the property belongs to.
   */
  design: Design;

  /**
   * The original property name.
   */
  oldName: string;

  /**
   * The new property name.
   */
  newName: string;
}

export const LayoutCreatedEvent = 'designs:layout:created';
export const LayoutDeletedEvent = 'designs:layout:deleted';
export const LayoutUpdatedEvent = 'designs:layout:updated';

export type LayoutCreatedEventData = Layout;
export type LayoutDeletedEventData = Layout;
export type LayoutUpdatedEventData = {
  original: Layout;
  updated: Layout;
};
