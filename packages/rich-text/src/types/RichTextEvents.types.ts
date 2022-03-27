import { EventListenerCallback } from '@minddrop/core';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

// Event types
export type RegisterRichTextElementEvent = 'rich-text-elements:register';

// Event data
export type RegisterRichTextElementEventData =
  | RichTextBlockElementConfig
  | RichTextInlineElementConfig;

// Event callbacks
export type RegisterRichTextElementEventCallback = EventListenerCallback<
  RegisterRichTextElementEvent,
  RegisterRichTextElementEventData
>;
