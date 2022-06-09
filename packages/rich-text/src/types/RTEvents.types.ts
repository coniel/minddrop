import { EventListenerCallback } from '@minddrop/core';
import { RTBlockElementConfig } from './RTBlockElementConfig.types';
import { RTDocument, RTDocumentChanges } from './RTDocument.types';
import { RTElement, RTElementChanges } from './RTElement.types';
import { RTInlineElementConfig } from './RTInlineElementConfig.types';

// Register rich text element type event
export type RegisterRTElementEvent = 'rich-text:element:register';

export type RegisterRTElementEventData =
  | RTBlockElementConfig
  | RTInlineElementConfig;

export type RegisterRTElementEventCallback = EventListenerCallback<
  RegisterRTElementEvent,
  RegisterRTElementEventData
>;

// Unegister rich text element type event
export type UnregisterRTElementEvent = 'rich-text:element:unregister';

export type UnregisterRTElementEventData =
  | RTBlockElementConfig
  | RTInlineElementConfig;

export type UnregisterRTElementEventCallback = EventListenerCallback<
  UnregisterRTElementEvent,
  UnregisterRTElementEventData
>;

// Create rich text element event
export type CreateRTElementEvent = 'rich-text:element:create';

export type CreateRTElementEventData = RTElement;

export type CreateRTElementEventCallback = EventListenerCallback<
  CreateRTElementEvent,
  CreateRTElementEventData
>;

// Update rich text element event
export type UpdateRTElementEvent = 'rich-text:element:update';

export interface UpdateRTElementEventData {
  /**
   * The element data before it was updated.
   */
  before: RTElement;

  /**
   * The element data after it was updated.
   */
  after: RTElement;

  /**
   * The changes applied to the element data.
   */
  changes: RTElementChanges;
}

export type UpdateRTElementEventCallback = EventListenerCallback<
  UpdateRTElementEvent,
  UpdateRTElementEventData
>;

// Delete rich text element event
export type DeleteRTElementEvent = 'rich-text:element:delete';

export type DeleteRTElementEventData = RTElement;

export type DeleteRTElementEventCallback = EventListenerCallback<
  DeleteRTElementEvent,
  DeleteRTElementEventData
>;

// Restore rich text element event
export type RestoreRTElementEvent = 'rich-text:element:restore';

export type RestoreRTElementEventData = RTElement;

export type RestoreRTElementEventCallback = EventListenerCallback<
  RestoreRTElementEvent,
  RestoreRTElementEventData
>;

// Permanently delete rich text element event
export type PermanentlyDeleteRTElementEvent =
  'rich-text:element:delete-permanently';

export type PermanentlyDeleteRTElementEventData = RTElement;

export type PermanentlyDeleteRTElementEventCallback = EventListenerCallback<
  PermanentlyDeleteRTElementEvent,
  PermanentlyDeleteRTElementEventData
>;

// Load rich text elements event
export type LoadRTElementsEvent = 'rich-text:element:load';

export type LoadRTElementsEventData = RTElement[];

export type LoadRTElementsEventCallback = EventListenerCallback<
  LoadRTElementsEvent,
  LoadRTElementsEventData
>;

// Create rich text document event
export type CreateRTDocumentEvent = 'rich-text:document:create';

export type CreateRTDocumentEventData = RTDocument;

export type CreateRTDocumentEventCallback = EventListenerCallback<
  CreateRTDocumentEvent,
  CreateRTDocumentEventData
>;

// Update rich text document event
export type UpdateRTDocumentEvent = 'rich-text:document:update';

export interface UpdateRTDocumentEventData {
  /**
   * The document data before it was updated.
   */
  before: RTDocument;

  /**
   * The document data after it was updated.
   */
  after: RTDocument;

  /**
   * The changes applied to the document data.
   */
  changes: RTDocumentChanges;
}

export type UpdateRTDocumentEventCallback = EventListenerCallback<
  UpdateRTDocumentEvent,
  UpdateRTDocumentEventData
>;

// Delete rich text document event
export type DeleteRTDocumentEvent = 'rich-text:document:delete';

export type DeleteRTDocumentEventData = RTDocument;

export type DeleteRTDocumentEventCallback = EventListenerCallback<
  DeleteRTDocumentEvent,
  DeleteRTDocumentEventData
>;

// Restore rich text document event
export type RestoreRTDocumentEvent = 'rich-text:document:restore';

export type RestoreRTDocumentEventData = RTDocument;

export type RestoreRTDocumentEventCallback = EventListenerCallback<
  RestoreRTDocumentEvent,
  RestoreRTDocumentEventData
>;

// Permanently delete rich text document event
export type PermanentlyDeleteRTDocumentEvent =
  'rich-text:document:delete-permanently';

export type PermanentlyDeleteRTDocumentEventData = RTDocument;

export type PermanentlyDeleteRTDocumentEventCallback = EventListenerCallback<
  PermanentlyDeleteRTDocumentEvent,
  PermanentlyDeleteRTDocumentEventData
>;

// Load rich text documents event
export type LoadRTDocumentsEvent = 'rich-text:document:load';

export type LoadRTDocumentsEventData = RTDocument[];

export type LoadRTDocumentsEventCallback = EventListenerCallback<
  LoadRTDocumentsEvent,
  LoadRTDocumentsEventData
>;
