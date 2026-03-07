import React from 'react';
import { RegisteredStore } from '@minddrop/stores';
import { JsonTree } from '../LogsPanel/JsonTree';
import { StoreInspector } from './StoreInspector';

interface RegistryStoreInspectorProps {
  /**
   * The registered store to inspect.
   */
  store: RegisteredStore;
}

/**
 * Renders a generic inspector for any registered store, regardless of type.
 * Array and object stores are shown as item lists; key-value stores
 * are shown as a JSON tree of their values.
 */
export const RegistryStoreInspector: React.FC<RegistryStoreInspectorProps> = ({
  store,
}) => {
  const state = store.useStore() as Record<string, unknown>;

  // Key-value stores have a `values` record
  if (store.type === 'key-value') {
    const values = state.values as Record<string, unknown>;

    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <JsonTree value={values} />
      </div>
    );
  }

  // Array stores have an `items` array
  if (store.type === 'array') {
    const items = (state.items as Record<string, unknown>[]) || [];

    return (
      <StoreInspector
        title={store.name.split(':')[1] || store.name}
        items={items}
        getLabel={(item) => getItemLabel(item)}
        getId={(item) => getItemId(item)}
      />
    );
  }

  // Object stores have an `items` record
  if (store.type === 'object') {
    const itemsRecord =
      (state.items as Record<string, Record<string, unknown>>) || {};
    const items = Object.values(itemsRecord);

    return (
      <StoreInspector
        title={store.name.split(':')[1] || store.name}
        items={items}
        getLabel={(item) => getItemLabel(item)}
        getId={(item) => getItemId(item)}
      />
    );
  }

  return null;
};

/**
 * Extracts a display label from a store item by looking for
 * common label-like fields.
 */
function getItemLabel(item: Record<string, unknown>): string {
  if (typeof item.name === 'string' && item.name) {
    return item.name;
  }

  if (typeof item.title === 'string' && item.title) {
    return item.title;
  }

  if (typeof item.label === 'string' && item.label) {
    return item.label;
  }

  return getItemId(item);
}

/**
 * Extracts an identifier from a store item by looking for
 * common ID-like fields.
 */
function getItemId(item: Record<string, unknown>): string {
  if (typeof item.id === 'string') {
    return item.id;
  }

  if (typeof item.key === 'string') {
    return item.key;
  }

  if (typeof item.type === 'string') {
    return item.type;
  }

  return JSON.stringify(item).slice(0, 40);
}
