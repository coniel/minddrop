import { ViewType } from './types';

export const ViewTypeRegisteredEvent = 'views:view-type:registered';
export const ViewTypeUnregisteredEvent = 'views:view-type:unregistered';

export type ViewTypeRegisteredEventData = ViewType;
export type ViewTypeUnregisteredEventData = ViewType;
