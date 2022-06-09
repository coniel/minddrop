import { EventListenerCallback } from '@minddrop/core';
import { FileReference, FileReferenceChanges } from './FileReference.types';

export type SaveFileEvent = 'files:file:save';
export type DeleteFileEvent = 'files:file:delete';
export type CreateFileReferenceEvent = 'files:file-reference:create';
export type UpdateFileReferenceEvent = 'files:file-reference:update';
export type DeleteFileReferenceEvent = 'files:file-reference:delete';
export type LoadFileReferencesEvent = 'files:file-reference:load';

export type CreateFileReferenceEventData = FileReference;
export type DeleteFileReferenceEventData = FileReference;
export type LoadFileReferencesEventData = FileReference[];

export interface SaveFileEventData {
  file: File;
  fileReference: FileReference;
}

export interface DeleteFileEventData {
  file: File;
  fileReference: FileReference;
}

export interface UpdateFileReferenceEventData {
  before: FileReference;
  after: FileReference;
  changes: FileReferenceChanges;
}

export type SaveFileEventCallback = EventListenerCallback<
  SaveFileEvent,
  SaveFileEventData
>;
export type DeleteFileEventCallback = EventListenerCallback<
  DeleteFileEvent,
  DeleteFileEventData
>;
export type CreateFileReferenceEventCallback = EventListenerCallback<
  CreateFileReferenceEvent,
  CreateFileReferenceEventData
>;
export type UpdateFileReferenceEventCallback = EventListenerCallback<
  UpdateFileReferenceEvent,
  UpdateFileReferenceEventData
>;
export type DeleteFileReferenceEventCallback = EventListenerCallback<
  DeleteFileReferenceEvent,
  DeleteFileReferenceEventData
>;
export type LoadFileReferencesEventCallback = EventListenerCallback<
  LoadFileReferencesEvent,
  LoadFileReferencesEventData
>;
