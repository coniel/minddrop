import { EventListenerCallback } from '@minddrop/core';
import { FileReference, FileReferenceChanges } from './FileReference.types';

export type CreateFileReferenceEvent = 'files:create';
export type UpdateFileReferenceEvent = 'files:update';
export type DeleteFileReferenceEvent = 'files:delete';
export type AddAttachmentsEvent = 'files:add-attachments';
export type RemoveAttachmentsEvent = 'files:remove-attachments';
export type ReplaceAttachmentsEvent = 'files:replace-attachments';
export type LoadFileReferencesEvent = 'files:load';
export type ClearFileReferencesEvent = 'files:clear';

export type DeleteFileReferenceEventData = FileReference;
export type LoadFileReferencesEventData = FileReference[];

export interface CreateFileReferenceEventData {
  reference: FileReference;
  file: File;
}

export interface UpdateFileReferenceEventData {
  before: FileReference;
  after: FileReference;
  changes: FileReferenceChanges;
}

export interface AddAttachmentsEventData {
  /**
   * The file reference to which the resources
   * were attached.
   */
  reference: FileReference;

  /**
   * The added resource IDs.
   */
  resourceIds: string[];
}

export interface RemoveAttachmentsEventData {
  /**
   * The file reference from which the resources
   * were removed.
   */
  reference: FileReference;

  /**
   * The removed resource IDs.
   */
  resourceIds: string[];
}

export interface ReplaceAttachmentsEventData {
  /**
   * The file reference to which the resources
   * were attached.
   */
  reference: FileReference;

  /**
   * The removed resource IDs.
   */
  oldResourceIds: string[];

  /**
   * The added resource IDs.
   */
  newResourceIds: string[];
}

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
export type AddAttachmentsEventCallback = EventListenerCallback<
  AddAttachmentsEvent,
  AddAttachmentsEventData
>;
export type RemoveAttachmentsEventCallback = EventListenerCallback<
  RemoveAttachmentsEvent,
  RemoveAttachmentsEventData
>;
export type ReplaceAttachmentsEventCallback = EventListenerCallback<
  ReplaceAttachmentsEvent,
  ReplaceAttachmentsEventData
>;
export type LoadFileReferencesEventCallback = EventListenerCallback<
  LoadFileReferencesEvent,
  LoadFileReferencesEventData
>;
export type ClearFileReferencesEventCallback =
  EventListenerCallback<ClearFileReferencesEvent>;
