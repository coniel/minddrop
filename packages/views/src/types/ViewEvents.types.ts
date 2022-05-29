import { EventListenerCallback } from '@minddrop/core';
import { RegisteredViewConfig } from './ViewConfig.types';
import { ViewInstance, ViewInstanceChanges } from './ViewInstance.types';

export type RegisterViewEvent = 'views:view:register';
export type UnregisterViewEvent = 'views:view:unregister';
export type CreateViewInstanceEvent = 'views:view-instance:create';
export type UpdateViewInstanceEvent = 'views:view-instance:update';
export type DeleteViewInstanceEvent = 'views:view-instance:delete';
export type RestoreViewInstanceEvent = 'views:view-instance:restore';
export type PermanentlyDeleteViewInstanceEvent =
  'views:view-instance:delete-permanently';
export type LoadViewInstancesEvent = 'views:view-instance:load';

export type RegisterViewEventData = RegisteredViewConfig;
export type UnregisterViewEventData = RegisteredViewConfig;
export type CreateViewInstanceEventData = ViewInstance;
export type DeleteViewInstanceEventData = ViewInstance;
export type RestoreViewInstanceEventData = ViewInstance;
export type PermanentlyDeleteViewInstanceEventData = ViewInstance;
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
export type RestoreViewInstanceEventCallback = EventListenerCallback<
  RestoreViewInstanceEvent,
  RestoreViewInstanceEventData
>;
export type PermanentlyDeleteViewInstanceEventCallback = EventListenerCallback<
  PermanentlyDeleteViewInstanceEvent,
  PermanentlyDeleteViewInstanceEventData
>;
export type LoadViewInstancesEventCallback = EventListenerCallback<
  LoadViewInstancesEvent,
  LoadViewInstancesEventData
>;
