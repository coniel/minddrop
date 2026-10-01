import { HistoryAction } from '@minddrop/history';
import { DatabaseHistoryCauses } from '../../constants';

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
  historyAction_propertyRenamed,
  historyAction_propertyOptionRenamed,
  historyAction_propertyRemoved,
];
