import { Core } from '@minddrop/core';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextElement, RichTextElementMap } from './RichTextElement.types';
import { RichTextElementFilters } from './RichTextElementFilters.types';
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
   * Retrieves a rich text element by ID.
   *
   * Throws a `RichTextElementNotFoundError` if the requested element does not exist.
   *
   * @param elementId The ID of the element to retrieve.
   * @rturns The requested rich text element.
   */
  get<T extends RichTextElement = RichTextElement>(elementId: string): T;

  /**
   * Retrieves rich text elements by ID.
   *
   * Returns a `{ [id]: RichTextElement }` map of the corresponding rich text elements.
   *
   * Throws a `RichTextElementNotFoundError` if a requested element does not exist.
   *
   * @param elementIds The IDs of the elements to retrieve.
   * @param filters Filtering options by which to filter returned elements.
   * @rturns A `{ [id]: RichTextElement }` map of the requested rich text elements.
   */
  get<T extends RichTextElement = RichTextElement>(
    elementIds: string[],
    filters?: RichTextElementFilters,
  ): RichTextElementMap<T>;

  /**
   * Returns all rich text elements as a `{ [id]: RichTextElement }` map.
   *
   * Optionally, the returned elements can by filtered by passing in
   * `RichTextElementFilters`.
   *
   * @param filters Optional filters by which to filter the returned elements.
   */
  getAll<T extends RichTextElement = RichTextElement>(
    filters?: RichTextElementFilters,
  ): RichTextElementMap<T>;

  /**
   * Filters rich text elements according to the provided filters.
   *
   * Provided elements must be of registered types, or a
   * `RichTextElementTypeNotRegisteredError` will be thrown.
   *
   * @param elements The rich text elements to filter.
   * @param filters The filtering options.
   * @returns The filtered rich text elements.
   */
  filter<T extends RichTextElement = RichTextElement>(
    elements: RichTextElementMap<T>,
    filters: RichTextElementFilters,
  ): RichTextElementMap<T>;
}
