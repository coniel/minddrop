import { Design, DesignRoleConfig } from './types';

export const DesignsLoadedEvent = 'designs:loaded';
export const DesignCreatedEvent = 'designs:design:created';
export const DesignUpdatedEvent = 'designs:design:updated';
export const DesignDeletedEvent = 'designs:design:deleted';
export const DesignPropertyRenamedEvent = 'designs:property:renamed';
export const DesignRoleRegisteredEvent = 'designs:role:registered';
export const DesignRoleUnregisteredEvent = 'designs:role:unregistered';

export type DesignsLoadedEventData = Design[];
export type DesignCreatedEventData = Design;
export type DesignDeletedEventData = Design;

export interface DesignUpdatedEventData {
  /**
   * The design as it was before the update.
   */
  original: Design;

  /**
   * The design as it is after the update.
   */
  updated: Design;
}

export interface DesignPropertyRenamedEventData {
  /**
   * The design the property belongs to.
   */
  design: Design;

  /**
   * The property's name before the rename.
   */
  oldName: string;

  /**
   * The property's name after the rename.
   */
  newName: string;
}

export type DesignRoleRegisteredEventData = DesignRoleConfig;
export type DesignRoleUnregisteredEventData = DesignRoleConfig;
