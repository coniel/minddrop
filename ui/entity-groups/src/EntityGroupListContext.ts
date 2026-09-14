import React, { createContext, useContext } from 'react';
import { EntityGroup, EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import { EntityGroupAddAction, ProtectedEntityGroupComponent } from './types';

export interface EntityGroupListContextValue {
  /**
   * The group type the list renders the groups of.
   */
  type: string;

  /**
   * The config of the group type.
   */
  config: EntityGroupTypeConfig;

  /**
   * Renders an item listed in a group.
   */
  renderItem: (itemId: string) => React.ReactNode;

  /**
   * Components rendering the contents of the groups the app
   * provides, keyed by group ID. Used in place of the items the
   * group lists.
   */
  protectedGroupComponents?: Record<string, ProtectedEntityGroupComponent>;

  /**
   * Returns the label a group is shown under, for groups whose name
   * is the app's rather than the user's, or null for groups which
   * are shown under their stored name.
   */
  resolveLabel?: (group: EntityGroup) => TranslationKey | null;

  /**
   * Returns the add control shown in a group's label row, or null
   * for groups which take no adding.
   */
  resolveAddAction?: (group: EntityGroup) => EntityGroupAddAction | null;
}

const EntityGroupListContext = createContext<EntityGroupListContextValue>({
  type: '',
  config: { id: '', itemTypes: [] },
  renderItem: () => null,
});

/**
 * Provides the group list a group, item or protected group
 * component belongs to.
 */
export const EntityGroupListProvider = EntityGroupListContext.Provider;

/**
 * Returns the group list surrounding the component.
 */
export function useEntityGroupList(): EntityGroupListContextValue {
  return useContext(EntityGroupListContext);
}
