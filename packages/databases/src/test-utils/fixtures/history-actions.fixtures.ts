import { HistoryAction } from '@minddrop/history';
import { EntryHistoryCauses } from '../../constants';

export const historyAction_propertyRenamed: HistoryAction = {
  id: 'action_propertyRenamed',
  cause: EntryHistoryCauses.PropertyRenamed,
};

export const historyAction_propertyOptionRenamed: HistoryAction = {
  id: 'action_propertyOptionRenamed',
  cause: EntryHistoryCauses.PropertyOptionRenamed,
};

export const historyAction_propertyRemoved: HistoryAction = {
  id: 'action_propertyRemoved',
  cause: EntryHistoryCauses.PropertyRemoved,
};

export const historyActions = [
  historyAction_propertyRenamed,
  historyAction_propertyOptionRenamed,
  historyAction_propertyRemoved,
];
