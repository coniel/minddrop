import React from 'react';
import { getStoreContentsCount, readStoreContents } from '@minddrop/dev-tools';
import { RegisteredStore } from '@minddrop/stores';
import { MenuItem } from '@minddrop/ui-primitives';

export interface StoreMenuItemProps {
  /**
   * The store the item selects.
   */
  store: RegisteredStore;

  /**
   * Whether the store is being inspected.
   */
  active: boolean;

  /**
   * Callback fired when the store is selected.
   */
  onClick: (store: RegisteredStore) => void;
}

/**
 * Renders a sidebar item for a registered store, showing how many
 * items or values it currently holds.
 */
export const StoreMenuItem: React.FC<StoreMenuItemProps> = ({
  store,
  active,
  onClick,
}) => {
  const state = store.useStore();
  const count = getStoreContentsCount(readStoreContents(store.type, state));

  // The namespace is already shown as the group's label
  const [, name] = store.name.split(':');

  const handleClick = () => {
    onClick(store);
  };

  return (
    <MenuItem size="compact" active={active} onClick={handleClick}>
      <span className="dev-tools-store-item">
        {name ?? store.name}
        <span className="dev-tools-store-item-count">{count}</span>
      </span>
    </MenuItem>
  );
};
