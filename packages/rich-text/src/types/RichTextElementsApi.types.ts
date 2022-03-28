import { Core } from '@minddrop/core';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextElement, RichTextElementMap } from './RichTextElement.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

export interface RichTextElementsApi {
  /**
   * Registers a new rich text element type and dispatches a
   * `rich-text-elements:register` event.
   *
   * Throws a `RichTextElementTypeAlreadyRegistered` if the element type
   * is already registered.
   *
   * @param core A MindDrop core instance.
   * @param config The configuration of the rich text element type to register.
   */
  register(
    core: Core,
    config: RichTextBlockElementConfig | RichTextInlineElementConfig,
  ): void;

  /**
   * Unregisters a rich text element type and dispaches a
   * `rich-text-elements:unregister` event.
   *
   * Throws a `RichTextElementTypeNotRegisteredError` if the
   * rich text element type is not registered.
   *
   * @param core A MindDrop core instance.
   * @param type The type of the rich text element to unregister.
   */
  unregister(core: Core, type: string): void;

  /**
   * Returns an element type's configuration object.
   *
   * Throws a `RichTextElementTypeNotRegisteredError` if the element
   * type is not registered.
   *
   * @param type The type of the element for wich to retrieve the config.
   * @returns The element's config object.
   */
  getConfig(
    type: string,
  ): RichTextBlockElementConfig | RichTextInlineElementConfig;

  /**
   * Retrieves rich text elements by ID.
   *
   * If provided a single ID string, returns the matching rich text element.
   * If provided an array of IDs, returns a `{ [id]: RichTextElement }` map of
   * the corresponding rich text elements.
   *
   * Throws a RichTextElementNotFoundError if a requested element does not exist.
   *
   * @param elementId The ID(s) of the element to retrieve.
   */
  get<T extends RichTextElement = RichTextElement>(elementId: string): T;
  get<T extends RichTextElement = RichTextElement>(
    elementIds: string[],
  ): RichTextElementMap<T>;
}
