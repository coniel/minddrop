import { EventListenerCallback } from '@minddrop/core';
import { FileReference } from './FileReference.types';

export type CreateFileReferenceEvent = 'files:create';
export type DeleteFileReferenceEvent = 'files:delete';
export type LoadFileReferencesEvent = 'files:load';
export type ClearFileReferencesEvent = 'files:clear';

export type DeleteFileReferenceEventData = FileReference;
export type LoadFileReferencesEventData = FileReference[];

export interface CreateFileReferenceEventData {
  reference: FileReference;
  file: File;
}

export type CreateFileReferenceEventCallback = EventListenerCallback<
  CreateFileReferenceEvent,
  CreateFileReferenceEventData
>;
export type DeleteFileReferenceEventCallback = EventListenerCallback<
  DeleteFileReferenceEvent,
  DeleteFileReferenceEventData
>;
export type LoadFileReferencesEventCallback = EventListenerCallback<
  LoadFileReferencesEvent,
  LoadFileReferencesEventData
>;
export type ClearFileReferencesEventCallback =
  EventListenerCallback<ClearFileReferencesEvent>;
