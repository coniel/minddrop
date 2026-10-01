import { HistoryAction } from '@minddrop/history';
import { DatabaseHistoryCauses } from '../../constants';

export const historyAction_databaseRenamed: HistoryAction = {
  id: 'action_databaseRenamed',
  cause: DatabaseHistoryCauses.DatabaseRenamed,
};

export const historyAction_databaseDeleted: HistoryAction = {
  id: 'action_databaseDeleted',
  cause: DatabaseHistoryCauses.DatabaseDeleted,
};

export const historyAction_entryRenamed: HistoryAction = {
  id: 'action_entryRenamed',
  cause: DatabaseHistoryCauses.EntryRenamed,
};

export const historyAction_propertyAdded: HistoryAction = {
  id: 'action_propertyAdded',
  cause: DatabaseHistoryCauses.PropertyAdded,
};

export const historyAction_propertyUpdated: HistoryAction = {
  id: 'action_propertyUpdated',
  cause: DatabaseHistoryCauses.PropertyUpdated,
};

export const historyAction_propertyRenamed: HistoryAction = {
  id: 'action_propertyRenamed',
  cause: DatabaseHistoryCauses.PropertyRenamed,
};

export const historyAction_propertyOptionRenamed: HistoryAction = {
  id: 'action_propertyOptionRenamed',
  cause: DatabaseHistoryCauses.PropertyOptionRenamed,
};

export const historyAction_propertyRemoved: HistoryAction = {
  id: 'action_propertyRemoved',
  cause: DatabaseHistoryCauses.PropertyRemoved,
};

export const historyActions = [
  historyAction_databaseRenamed,
  historyAction_databaseDeleted,
  historyAction_entryRenamed,
  historyAction_propertyAdded,
  historyAction_propertyUpdated,
  historyAction_propertyRenamed,
  historyAction_propertyOptionRenamed,
  historyAction_propertyRemoved,
];
