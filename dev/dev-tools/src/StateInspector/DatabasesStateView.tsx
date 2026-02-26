import React from 'react';
import {
  Databases,
  DatabaseAutomations,
  DatabaseEntries,
  DatabaseEntrySerializers,
  DatabaseTemplates,
} from '@minddrop/databases';
import { StoreInspector } from './StoreInspector';

export type DatabasesStateViewId =
  | 'databases'
  | 'database-entries'
  | 'database-templates'
  | 'database-automations'
  | 'database-serializers';

interface DatabasesStateViewProps {
  stateView: DatabasesStateViewId;
}

export function useDatabaseStoreCounts() {
  const databases = Databases.useAll();
  const entries = DatabaseEntries.Store.useAllItems();
  const templates = DatabaseTemplates.useAll();
  const automations = DatabaseAutomations.useAll();
  const serializers = DatabaseEntrySerializers.useAll();

  return {
    databases: databases.length,
    'database-entries': entries.length,
    'database-templates': templates.length,
    'database-automations': automations.length,
    'database-serializers': serializers.length,
  };
}

export const DatabasesStateView: React.FC<DatabasesStateViewProps> = ({
  stateView,
}) => {
  const databases = Databases.useAll();
  const entries = DatabaseEntries.Store.useAllItems();
  const templates = DatabaseTemplates.useAll();
  const automations = DatabaseAutomations.useAll();
  const serializers = DatabaseEntrySerializers.useAll();

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

  if (stateView === 'database-automations') {
    return (
      <StoreInspector
        title="Database Automations"
        items={automations}
        getLabel={(automation) => automation.name}
        getId={(automation) => automation.type}
      />
    );
  }

  if (stateView === 'database-serializers') {
    return (
      <StoreInspector
        title="Database Entry Serializers"
        items={serializers}
        getLabel={(serializer) => serializer.name}
        getId={(serializer) => serializer.id}
      />
    );
  }

  return null;
};
