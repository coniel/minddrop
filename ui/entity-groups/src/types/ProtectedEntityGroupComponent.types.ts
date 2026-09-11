import React from 'react';
import { EntityGroup } from '@minddrop/entity-groups';

export interface ProtectedEntityGroupProps {
  /**
   * The group the contents are rendered in.
   */
  group: EntityGroup;
}

/**
 * A component rendering the contents of a group the app provides,
 * in place of the items it lists. It assembles them out of
 * `EntityGroupItem`, deciding for itself what can be dragged out of
 * the group.
 */
export type ProtectedEntityGroupComponent =
  React.ComponentType<ProtectedEntityGroupProps>;
