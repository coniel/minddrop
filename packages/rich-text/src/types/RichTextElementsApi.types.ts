import { Core } from '@minddrop/core';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import {
  CreateRichTextElementData,
  RichTextElement,
  RichTextElementMap,
  UpdateRichTextElementData,
} from './RichTextElement.types';
import { RichTextElementFilters } from './RichTextElementFilters.types';
import {
  CreateRichTextElementEvent,
  CreateRichTextElementEventCallback,
  DeleteRichTextElementEvent,
  DeleteRichTextElementEventCallback,
  PermanentlyDeleteRichTextElementEvent,
  PermanentlyDeleteRichTextElementEventCallback,
  RegisterRichTextElementEvent,
  RegisterRichTextElementEventCallback,
  RestoreRichTextElementEvent,
  RestoreRichTextElementEventCallback,
  UnregisterRichTextElementEvent,
  UnregisterRichTextElementEventCallback,
  UpdateRichTextElementEvent,
  UpdateRichTextElementEventCallback,
} from './RichTextEvents.types';
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

  /**
   * Creates a new rich text element and dispatches a `rich-text-elements:create`
   * event.
   *
   * Adds the element as a parent on files listed in the `files` property.
   *
   * The element type must be registered, if not, throws a
   * `RichTextElementTypeNotRegisteredError`.
   *
   * Throws a `RichTextElementValidationError` if the element contains invalid
   * data or is missing required fields.
   *
   * Returns the newly created element.
   *
   * @param core A MindDrop core instance.
   * @param data The element data.
   * @returns The newly created rich text element.
   */
  create<
    TElement extends RichTextElement = RichTextElement,
    TData extends CreateRichTextElementData = CreateRichTextElementData,
  >(
    core: Core,
    data: TData,
  ): TElement;

  /**
   * Updates a rich text element and dispatches a
   * `rich-text-elemets:update` event. Returns the updated element.
   *
   * - Throws a `RichTextElementNotFoundError` if the element does
   *   not exist.
   * - Throws a `RichTextElementTypeNotRegistered` if the element
   *   type is not registered
   * - Throws a `RichTextElementValidationError` if the updated
   *   element is invalid.
   *
   * @param core A MindDrop core instance.
   * @param elementId The ID of the element to update.
   * @param data The changes to apply to the element.
   * @returns The updated element.
   */
  update<
    TElement extends RichTextElement = RichTextElement,
    TData extends UpdateRichTextElementData = UpdateRichTextElementData,
  >(
    core: Core,
    elementId: string,
    data: TData,
  ): TElement;

  /**
   * Restores a rich text element and dispatches a
   * `rich-text-elements:restore` event. Returns the restored
   * element.
   *
   * - Throws a `RichTextElementNotFoundError` if the element
   *   does not exist.
   *
   * @param core A MindDrop core instance.
   * @param elementId The ID of the element to restore.
   * @returns The restored element.
   */
  restore<TElement extends RichTextElement = RichTextElement>(
    core: Core,
    elementId: string,
  ): TElement;

  /**
   * Deletes a rich text element and dispatches a
   * `rich-text-elements:delete` event.
   *
   * - Throws a `RichTextElementNotFoundError` if the element
   *   does not exist.
   *
   * @param core A MindDrop core instance.
   * @param elementId The ID of the element to delete.
   */
  delete<TElement extends RichTextElement = RichTextElement>(
    core: Core,
    elementId: string,
  ): TElement;

  /**
   * Permanently deletes a rich text element and dispatches a
   * `rich-text-elements:delete-permanently` event. Returns the
   * permanently deleted element.
   *
   * - Trhows a `RichTextElementNotFoundError` if the element
   *   does not exist.
   *
   * @param core A MindDrop core instance.
   * @param elementId The ID of the element to permanently delete.
   * @returns The permanently deleted element.
   */
  deletePermanently<TElement extends RichTextElement = RichTextElement>(
    core: Core,
    elementId: string,
  ): TElement;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'rich-text-elements:register' event listener
  addEventListener(
    core: Core,
    type: RegisterRichTextElementEvent,
    callback: RegisterRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterRichTextElementEvent,
    callback: UnregisterRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:create' event listener
  addEventListener(
    core: Core,
    type: CreateRichTextElementEvent,
    callback: CreateRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:update' event listener
  addEventListener(
    core: Core,
    type: UpdateRichTextElementEvent,
    callback: UpdateRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteRichTextElementEvent,
    callback: DeleteRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreRichTextElementEvent,
    callback: RestoreRichTextElementEventCallback,
  ): void;

  // Add 'rich-text-elements:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteRichTextElementEvent,
    callback: PermanentlyDeleteRichTextElementEventCallback,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'rich-text-elements:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterRichTextElementEvent,
    callback: RegisterRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterRichTextElementEvent,
    callback: UnregisterRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:create' event listener
  removeEventListener(
    core: Core,
    type: CreateRichTextElementEvent,
    callback: CreateRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateRichTextElementEvent,
    callback: UpdateRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteRichTextElementEvent,
    callback: DeleteRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreRichTextElementEvent,
    callback: RestoreRichTextElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteRichTextElementEvent,
    callback: PermanentlyDeleteRichTextElementEventCallback,
  ): void;
}
