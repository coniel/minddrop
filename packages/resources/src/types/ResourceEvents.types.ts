import { EventListenerCallback } from '@minddrop/core';
import { ResourceApi } from './ResourceApi.types';
import { ResourceStorageAdapterConfig } from './ResourceStorageAdapterConfig.types';

export type RegisterResourceEvent = 'resources:resource:register';
export type UnregisterResourceEvent = 'resources:resource:unregister';
export type RegisterResourceStorageAdapterEvent =
  'resources:storage-adapter:register';
export type UnregisterResourceStorageAdapterEvent =
  'resources:storage-adapter:unregister';

export type RegisterResourceEventData = ResourceApi;
export type UnregisterResourceEventData = ResourceApi;
export type RegisterResourceStorageAdapterEventData =
  ResourceStorageAdapterConfig;
export type UnregisterResourceStorageAdapterEventData =
  ResourceStorageAdapterConfig;

export type RegisterResourceEventCallback = EventListenerCallback<
  RegisterResourceEvent,
  RegisterResourceEventData
>;
export type UnregisterResourceEventCallback = EventListenerCallback<
  UnregisterResourceEvent,
  UnregisterResourceEventData
>;
export type RegisterResourceStorageAdapterEventCallback = EventListenerCallback<
  RegisterResourceStorageAdapterEvent,
  RegisterResourceStorageAdapterEventData
>;
export type UnregisterResourceStorageAdapterEventCallback =
  EventListenerCallback<
    UnregisterResourceStorageAdapterEvent,
    UnregisterResourceStorageAdapterEventData
  >;
