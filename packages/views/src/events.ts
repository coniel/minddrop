import { View } from './types';

export const ViewCreatedEvent = 'views:view:created';
export const ViewUpdatedEvent = 'views:view:updated';
export const ViewDeletedEvent = 'views:view:deleted';

export type ViewCreatedEventData = View;

export type ViewUpdatedEventData = {
  original: View;
  updated: View;
};

export type ViewDeletedEventData = View;
