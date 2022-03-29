import { EventListenerCallback } from '@minddrop/core';
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
