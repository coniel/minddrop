import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { RegisteredStore } from '@minddrop/stores';
import {
  MenuGroup,
  MenuLabel,
  Separator,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { useRegisteredStores } from '../useRegisteredStores';
import { groupRegisteredStores } from '../utils';
import { StoreContentsView } from './StoreContentsView';
import { StoreMenuItem } from './StoreMenuItem';
import './StatePanel.css';

/**
 * Renders the contents of the registered stores, listing them by
 * namespace in the panel sidebar.
 */
export const StatePanel: React.FC = () => {
  const [selectedStoreName, setSelectedStoreName] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const stores = useRegisteredStores();

  const groups = useMemo(() => groupRegisteredStores(stores), [stores]);

  // Fall back to the first store, so the panel always shows
  // something when any store is registered
  const selectedStore =
    stores.find((store) => store.name === selectedStoreName) ??
    stores[0] ??
    null;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  // Items of one store rarely match a search made in another
  const handleSelectStore = useCallback((store: RegisteredStore) => {
    setSelectedStoreName(store.name);
    setSearch('');
  }, []);

  const sidebar = groups.map((group, index) => (
    <React.Fragment key={group.namespace}>
      {index > 0 && <Separator margin="small" />}

      <MenuGroup>
        <MenuLabel stringLabel={group.namespace} />

        {group.stores.map((store) => (
          <StoreMenuItem
            key={store.name}
            store={store}
            active={selectedStore?.name === store.name}
            onClick={handleSelectStore}
          />
        ))}
      </MenuGroup>
    </React.Fragment>
  ));

  const toolbar = (
    <TextInput
      size="sm"
      className="dev-tools-state-search"
      placeholder="devTools.state.searchPlaceholder"
      value={search}
      clearable
      onChange={handleSearchChange}
      onClear={handleClearSearch}
    />
  );

  return (
    <DevToolsPanelLayout sidebar={sidebar} toolbar={toolbar}>
      {!selectedStore && (
        <Text size="sm" color="subtle" className="dev-tools-state-empty">
          {t('devTools.state.noStores')}
        </Text>
      )}

      {selectedStore && (
        <StoreContentsView store={selectedStore} search={search} />
      )}
    </DevToolsPanelLayout>
  );
};
