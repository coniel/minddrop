import { EventListenerCallback, ParentReference } from '@minddrop/core';
import { FileReference } from '@minddrop/files';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import {
  RichTextDocument,
  RichTextDocumentChanges,
} from './RichTextDocument.types';
import {
  RichTextElement,
  RichTextElementChanges,
  RichTextElementMap,
} from './RichTextElement.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

// Register rich text element type event
export type RegisterRichTextElementEvent = 'rich-text-elements:register';

export type RegisterRichTextElementEventData =
  | RichTextBlockElementConfig
  | RichTextInlineElementConfig;

export type RegisterRichTextElementEventCallback = EventListenerCallback<
  RegisterRichTextElementEvent,
  RegisterRichTextElementEventData
>;

// Unegister rich text element type event
export type UnregisterRichTextElementEvent = 'rich-text-elements:unregister';

export type UnregisterRichTextElementEventData =
  | RichTextBlockElementConfig
  | RichTextInlineElementConfig;

export type UnregisterRichTextElementEventCallback = EventListenerCallback<
  UnregisterRichTextElementEvent,
  UnregisterRichTextElementEventData
>;

// Create rich text element event
export type CreateRichTextElementEvent = 'rich-test-elements:create';

export type CreateRichTextElementEventData = RichTextElement;

export type CreateRichTextElementEventCallback = EventListenerCallback<
  CreateRichTextElementEvent,
  CreateRichTextElementEventData
>;

// Update rich text element event
export type UpdateRichTextElementEvent = 'rich-test-elements:update';

export interface UpdateRichTextElementEventData {
  /**
   * The element data before it was updated.
   */
  before: RichTextElement;

  /**
   * The element data after it was updated.
   */
  after: RichTextElement;

  /**
   * The changes applied to the element data.
   */
  changes: RichTextElementChanges;
}

export type UpdateRichTextElementEventCallback = EventListenerCallback<
  UpdateRichTextElementEvent,
  UpdateRichTextElementEventData
>;

// Delete rich text element event
export type DeleteRichTextElementEvent = 'rich-test-elements:delete';

export type DeleteRichTextElementEventData = RichTextElement;

export type DeleteRichTextElementEventCallback = EventListenerCallback<
  DeleteRichTextElementEvent,
  DeleteRichTextElementEventData
>;

// Restore rich text element event
export type RestoreRichTextElementEvent = 'rich-test-elements:restore';

export type RestoreRichTextElementEventData = RichTextElement;

export type RestoreRichTextElementEventCallback = EventListenerCallback<
  RestoreRichTextElementEvent,
  RestoreRichTextElementEventData
>;

// Permanently delete rich text element event
export type PermanentlyDeleteRichTextElementEvent =
  'rich-test-elements:delete-permanently';

export type PermanentlyDeleteRichTextElementEventData = RichTextElement;

export type PermanentlyDeleteRichTextElementEventCallback =
  EventListenerCallback<
    PermanentlyDeleteRichTextElementEvent,
    PermanentlyDeleteRichTextElementEventData
  >;

// Add parents to rich text element event
export type AddParentsToRichTextElementEvent = 'rich-test-elements:add-parents';

export type AddParentsToRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The parent references added to the element.
   */
  parents: ParentReference[];
};

export type AddParentsToRichTextElementEventCallback = EventListenerCallback<
  AddParentsToRichTextElementEvent,
  AddParentsToRichTextElementEventData
>;

// Remove parents from rich text element event
export type RemoveParentsFromRichTextElementEvent =
  'rich-test-elements:remove-parents';

export type RemoveParentsFromRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The parent references removed from the element.
   */
  parents: ParentReference[];
};

export type RemoveParentsFromRichTextElementEventCallback =
  EventListenerCallback<
    RemoveParentsFromRichTextElementEvent,
    RemoveParentsFromRichTextElementEventData
  >;

// Nest rich text elements event
export type NestRichTextElementEvent = 'rich-test-elements:nest';

export type NestRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The IDs of the elements that were nested.
   */
  nestedElements: RichTextElementMap;
};

export type NestRichTextElementEventCallback = EventListenerCallback<
  NestRichTextElementEvent,
  NestRichTextElementEventData
>;

// Unnest rich text elements event
export type UnnestRichTextElementEvent = 'rich-test-elements:unnest';

export type UnnestRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The IDs of the elements that were unnested.
   */
  unnestedElements: RichTextElementMap;
};

export type UnnestRichTextElementEventCallback = EventListenerCallback<
  UnnestRichTextElementEvent,
  UnnestRichTextElementEventData
>;

// Add files to rich text element event
export type AddFilesToRichTextElementEvent = 'rich-test-elements:add-files';

export type AddFilesToRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The file references added to the element.
   */
  files: FileReference[];
};

export type AddFilesToRichTextElementEventCallback = EventListenerCallback<
  AddFilesToRichTextElementEvent,
  AddFilesToRichTextElementEventData
>;

// Remove files from rich text element event
export type RemoveFilesFromRichTextElementEvent =
  'rich-test-elements:remove-files';

export type RemoveFilesFromRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The file references removed from the element.
   */
  files: FileReference[];
};

export type RemoveFilesFromRichTextElementEventCallback = EventListenerCallback<
  RemoveFilesFromRichTextElementEvent,
  RemoveFilesFromRichTextElementEventData
>;

// Replace files in rich text element event
export type ReplaceFilesInRichTextElementEvent =
  'rich-test-elements:replace-files';

export type ReplaceFilesInRichTextElementEventData = {
  /**
   * The updated element.
   */
  element: RichTextElement;

  /**
   * The file references removed from the element.
   */
  removedFiles: FileReference[];

  /**
   * The file references added to the element.
   */
  addedFiles: FileReference[];
};

export type ReplaceFilesInRichTextElementEventCallback = EventListenerCallback<
  ReplaceFilesInRichTextElementEvent,
  ReplaceFilesInRichTextElementEventData
>;

// Load rich text elements event
export type LoadRichTextElementsEvent = 'rich-test-elements:load';

export type LoadRichTextElementsEventData = RichTextElement[];

export type LoadRichTextElementsEventCallback = EventListenerCallback<
  LoadRichTextElementsEvent,
  LoadRichTextElementsEventData
>;

// Create rich text document event
export type CreateRichTextDocumentEvent = 'rich-test-documents:create';

export type CreateRichTextDocumentEventData = RichTextDocument;

export type CreateRichTextDocumentEventCallback = EventListenerCallback<
  CreateRichTextDocumentEvent,
  CreateRichTextDocumentEventData
>;

// Update rich text document event
export type UpdateRichTextDocumentEvent = 'rich-test-documents:update';

export interface UpdateRichTextDocumentEventData {
  /**
   * The document data before it was updated.
   */
  before: RichTextDocument;

  /**
   * The document data after it was updated.
   */
  after: RichTextDocument;

  /**
   * The changes applied to the document data.
   */
  changes: RichTextDocumentChanges;
}

export type UpdateRichTextDocumentEventCallback = EventListenerCallback<
  UpdateRichTextDocumentEvent,
  UpdateRichTextDocumentEventData
>;

// Delete rich text document event
export type DeleteRichTextDocumentEvent = 'rich-test-documents:delete';

export type DeleteRichTextDocumentEventData = RichTextDocument;

export type DeleteRichTextDocumentEventCallback = EventListenerCallback<
  DeleteRichTextDocumentEvent,
  DeleteRichTextDocumentEventData
>;

// Restore rich text document event
export type RestoreRichTextDocumentEvent = 'rich-test-documents:restore';

export type RestoreRichTextDocumentEventData = RichTextDocument;

export type RestoreRichTextDocumentEventCallback = EventListenerCallback<
  RestoreRichTextDocumentEvent,
  RestoreRichTextDocumentEventData
>;

// Permanently delete rich text document event
export type PermanentlyDeleteRichTextDocumentEvent =
  'rich-test-documents:delete-permanently';

export type PermanentlyDeleteRichTextDocumentEventData = RichTextDocument;

export type PermanentlyDeleteRichTextDocumentEventCallback =
  EventListenerCallback<
    PermanentlyDeleteRichTextDocumentEvent,
    PermanentlyDeleteRichTextDocumentEventData
  >;

// Set children in rich text document event
export type SetChildrenInRichTextDocumentEvent =
  'rich-text-documents:set-children';

export interface SetChildrenInRichTextDocumentEventData {
  /**
   * The document in which the children were set.
   */
  document: RichTextDocument;

  /**
   * The elements that were removed from the document.
   */
  removedElements: RichTextElementMap;

  /**
   * The elements that were added to the document.
   */
  addedElements: RichTextElementMap;
}

export type SetChildrenInRichTextDocumentEventCallback = EventListenerCallback<
  SetChildrenInRichTextDocumentEvent,
  SetChildrenInRichTextDocumentEventData
>;

// Add parents to rich text document event
export type AddParentsToRichTextDocumentEvent =
  'rich-test-documents:add-parents';

export type AddParentsToRichTextDocumentEventData = {
  /**
   * The updated document.
   */
  document: RichTextDocument;

  /**
   * The parent references added to the document.
   */
  parents: ParentReference[];
};

export type AddParentsToRichTextDocumentEventCallback = EventListenerCallback<
  AddParentsToRichTextDocumentEvent,
  AddParentsToRichTextDocumentEventData
>;

// Remove parents from rich text document event
export type RemoveParentsFromRichTextDocumentEvent =
  'rich-test-documents:remove-parents';

export type RemoveParentsFromRichTextDocumentEventData = {
  /**
   * The updated document.
   */
  document: RichTextDocument;

  /**
   * The parent references removed from the document.
   */
  parents: ParentReference[];
};

export type RemoveParentsFromRichTextDocumentEventCallback =
  EventListenerCallback<
    RemoveParentsFromRichTextDocumentEvent,
    RemoveParentsFromRichTextDocumentEventData
  >;

// Load rich text documents event
export type LoadRichTextDocumentsEvent = 'rich-test-documents:load';

export type LoadRichTextDocumentsEventData = RichTextDocument[];

export type LoadRichTextDocumentsEventCallback = EventListenerCallback<
  LoadRichTextDocumentsEvent,
  LoadRichTextDocumentsEventData
>;
