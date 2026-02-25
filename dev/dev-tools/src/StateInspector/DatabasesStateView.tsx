import React from 'react';
import {
  Databases,
  DatabaseEntries,
  DatabaseTemplates,
} from '@minddrop/databases';
import { StoreInspector } from './StoreInspector';

type StateView = 'databases' | 'database-entries' | 'database-templates';

interface DatabasesStateViewProps {
  stateView: StateView;
}

export function useDatabaseStoreCounts() {
  const databases = Databases.useAll();
  const entries = DatabaseEntries.Store.useAllItems();
  const templates = DatabaseTemplates.useAll();
  return {
    databases: databases.length,
    'database-entries': entries.length,
    'database-templates': templates.length,
  };
}

export const DatabasesStateView: React.FC<DatabasesStateViewProps> = ({
  stateView,
}) => {
  const databases = Databases.useAll();
  const entries = DatabaseEntries.Store.useAllItems();
  const templates = DatabaseTemplates.useAll();

  if (stateView === 'databases') {
    return (
      <StoreInspector
        title="Databases"
        items={databases}
        getLabel={(db) => db.name || '—'}
        getId={(db) => db.id}
      />
    );
  }

  if (stateView === 'database-entries') {
    return (
      <StoreInspector
        title="Database Entries"
        items={entries}
        getLabel={(entry) => entry.title || entry.id}
        getId={(entry) => entry.id}
      />
    );
  }

  if (stateView === 'database-templates') {
    return (
      <StoreInspector
        title="Database Templates"
        items={templates}
        getLabel={(template) => template.name}
        getId={(template) => template.name}
      />
    );
  }

  return null;
};
