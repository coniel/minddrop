import React, { useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { RegisteredStore } from '@minddrop/stores';
import { Icon, Text } from '@minddrop/ui-primitives';
import { JsonTree } from '../JsonTree';
import {
  filterStoreItems,
  getStoreItemId,
  getStoreItemLabel,
  readStoreContents,
} from '../utils';

export interface StoreContentsViewProps {
  /**
   * The store to inspect.
   */
  store: RegisteredStore;

  /**
   * Text the listed items are filtered by.
   */
  search: string;
}

/**
 * Renders a store's contents: key-value stores as a tree of their
 * values, array and object stores as a list of expandable items.
 */
export const StoreContentsView: React.FC<StoreContentsViewProps> = ({
  store,
  search,
}) => {
  const { t } = useTranslation();
  const state = store.useStore();
  const contents = readStoreContents(store.type, state);

  // Key-value stores hold one record rather than a list, so the
  // whole record is rendered as a tree
  if (contents.kind === 'values') {
    return (
      <div className="dev-tools-state-values">
        <JsonTree value={contents.values} />
      </div>
    );
  }

  const items = filterStoreItems(contents.items, search);

  return (
    <div className="dev-tools-state-items">
      {items.length === 0 && (
        <Text size="sm" color="subtle" className="dev-tools-state-empty">
          {contents.items.length === 0
            ? t('devTools.state.emptyStore')
            : t('devTools.state.noMatches')}
        </Text>
      )}

      {items.map((item) => (
        <StoreItemRow key={getStoreItemId(item)} item={item} />
      ))}
    </div>
  );
};

interface StoreItemRowProps {
  /**
   * The store item to render.
   */
  item: Record<string, unknown>;
}

/**
 * Renders a store item, expanding to show its full contents.
 */
const StoreItemRow: React.FC<StoreItemRowProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const label = getStoreItemLabel(item);
  const id = getStoreItemId(item);

  const handleToggle = () => {
    setExpanded((previous) => !previous);
  };

  return (
    <div className="dev-tools-state-item">
      <div className="dev-tools-state-item-row" onClick={handleToggle}>
        <Icon
          className="dev-tools-state-item-toggle"
          name={expanded ? 'chevron-down' : 'chevron-right'}
          color="subtle"
        />

        <Text size="sm" className="dev-tools-state-item-label">
          {label}
        </Text>

        {id !== label && (
          <Text
            mono
            size="xs"
            color="subtle"
            className="dev-tools-state-item-id"
          >
            {id}
          </Text>
        )}
      </div>

      {expanded && (
        <div className="dev-tools-state-item-body">
          <JsonTree value={item} />
        </div>
      )}
    </div>
  );
};
