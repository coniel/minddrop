import { EventListenerCallback } from '@minddrop/core';
import { View } from './View.types';
import { ViewInstance, ViewInstanceChanges } from './ViewInstance.types';

export type RegisterViewEvent = 'views:register';
export type UnregisterViewEvent = 'views:unregister';
export type CreateViewInstanceEvent = 'views:create-instance';
export type UpdateViewInstanceEvent = 'views:update-instance';
export type DeleteViewInstanceEvent = 'views:delete-instance';
export type LoadViewInstancesEvent = 'views:load-instances';
export type ClearViewsEvent = 'views:clear';

export type RegisterViewEventData = View;
export type UnregisterViewEventData = View;
export type CreateViewInstanceEventData = ViewInstance;
export type DeleteViewInstanceEventData = ViewInstance;
export type LoadViewInstancesEventData = ViewInstance[];

export interface UpdateViewInstanceEventData {
  before: ViewInstance;
  after: ViewInstance;
  changes: ViewInstanceChanges;
}

export type RegisterViewEventCallback = EventListenerCallback<
  RegisterViewEvent,
  RegisterViewEventData
>;
export type UnregisterViewEventCallback = EventListenerCallback<
  UnregisterViewEvent,
  UnregisterViewEventData
>;
export type CreateViewInstanceEventCallback = EventListenerCallback<
  CreateViewInstanceEvent,
  CreateViewInstanceEventData
>;
export type UpdateViewInstanceEventCallback = EventListenerCallback<
  UpdateViewInstanceEvent,
  UpdateViewInstanceEventData
>;
export type DeleteViewInstanceEventCallback = EventListenerCallback<
  DeleteViewInstanceEvent,
  DeleteViewInstanceEventData
>;
export type LoadViewInstancesEventCallback = EventListenerCallback<
  LoadViewInstancesEvent,
  LoadViewInstancesEventData
>;
export type ClearViewsEventCallback = EventListenerCallback<ClearViewsEvent>;
