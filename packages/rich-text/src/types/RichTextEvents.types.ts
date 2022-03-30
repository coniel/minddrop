import { EventListenerCallback, ParentReference } from '@minddrop/core';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import {
  RichTextElement,
  RichTextElementChanges,
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

// Remove parents to rich text element event
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
  nestedElements: string[];
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
  unnestedElements: string[];
};

export type UnnestRichTextElementEventCallback = EventListenerCallback<
  UnnestRichTextElementEvent,
  UnnestRichTextElementEventData
>;
