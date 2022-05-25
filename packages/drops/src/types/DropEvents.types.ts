import { EventListenerCallback } from '@minddrop/core';
import { Drop, DropChanges } from './Drop.types';
import { DropTypeConfig } from './DropTypeConfig.types';

export type RegisterDropTypeEvent = 'drops:drop:register';
export type UnregisterDropTypeEvent = 'drops:drop:unregister';
export type CreateDropEvent = 'drops:drop:create';
export type UpdateDropEvent = 'drops:drop:update';
export type DeleteDropEvent = 'drops:drop:delete';
export type RestoreDropEvent = 'drops:drop:restore';
export type PermanentlyDeleteDropEvent = 'drops:drop:delete-permanently';
export type LoadDropsEvent = 'drops:drop:load';
export type AddDropEvent = 'drops:drop:add';
export type SetDropEvent = 'drops:drop:set';
export type RemoveDropEvent = 'drops:drop:remove';

export type RegisterDropTypeEventData = DropTypeConfig;
export type UnregisterDropTypeEventData = DropTypeConfig;
export type CreateDropEventData = Drop;
export type DeleteDropEventData = Drop;
export type RestoreDropEventData = Drop;
export type PermanentlyDeleteDropEventData = Drop;
export type LoadDropsEventData = Drop[];
export type AddDropEventData = Drop;
export type SetDropEventData = Drop;
export type RemoveDropEventData = Drop;

export interface UpdateDropEventData {
  /**
   * The drop data prior to being updated.
   */
  before: Drop;

  /**
   * The updated drop data.
   */
  after: Drop;

  /**
   * The changes made to the drop data.
   */
  changes: DropChanges;
}

export type RegisterDropTypeEventCallback = EventListenerCallback<
  RegisterDropTypeEvent,
  RegisterDropTypeEventData
>;
export type UnregisterDropTypeEventCallback = EventListenerCallback<
  UnregisterDropTypeEvent,
  UnregisterDropTypeEventData
>;
export type CreateDropEventCallback = EventListenerCallback<
  CreateDropEvent,
  CreateDropEventData
>;
export type UpdateDropEventCallback = EventListenerCallback<
  UpdateDropEvent,
  UpdateDropEventData
>;
export type DeleteDropEventCallback = EventListenerCallback<
  DeleteDropEvent,
  DeleteDropEventData
>;
export type RestoreDropEventCallback = EventListenerCallback<
  RestoreDropEvent,
  RestoreDropEventData
>;
export type PermanentlyDeleteDropEventCallback = EventListenerCallback<
  PermanentlyDeleteDropEvent,
  PermanentlyDeleteDropEventData
>;
export type LoadDropsEventCallback = EventListenerCallback<
  LoadDropsEvent,
  LoadDropsEventData
>;
export type AddDropEventCallback = EventListenerCallback<
  AddDropEvent,
  AddDropEventData
>;
export type SetDropEventCallback = EventListenerCallback<
  SetDropEvent,
  SetDropEventData
>;
export type RemoveDropEventCallback = EventListenerCallback<
  RemoveDropEvent,
  RemoveDropEventData
>;
