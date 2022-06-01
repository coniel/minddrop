import { Core, DataInsert } from '@minddrop/core';
import { TypedResourceApi } from '@minddrop/resources';
import { RTBlockElementConfig } from './RTBlockElementConfig.types';
import {
  RTBlockElement,
  BaseCreateRTElementData,
  RTElement,
  RTElementMap,
  BaseUpdateRTElementData,
  BaseRTElementData,
  RTElementTypeData,
} from './RTElement.types';
import { RTElementFilters } from './RTElementFilters.types';
import {
  CreateRTElementEvent,
  CreateRTElementEventCallback,
  DeleteRTElementEvent,
  DeleteRTElementEventCallback,
  LoadRTElementsEvent,
  LoadRTElementsEventCallback,
  PermanentlyDeleteRTElementEvent,
  PermanentlyDeleteRTElementEventCallback,
  RegisterRTElementEvent,
  RegisterRTElementEventCallback,
  RestoreRTElementEvent,
  RestoreRTElementEventCallback,
  UnregisterRTElementEvent,
  UnregisterRTElementEventCallback,
  UpdateRTElementEvent,
  UpdateRTElementEventCallback,
} from './RTEvents.types';
import { RTFragment } from './RTFragment.types';
import { RTInlineElementConfig } from './RTInlineElementConfig.types';

export interface RTElementsApi
  extends TypedResourceApi<
    BaseRTElementData,
    BaseCreateRTElementData,
    BaseUpdateRTElementData,
    RTBlockElementConfig | RTInlineElementConfig
  > {
  /**
   * Registers a new rich text element type.
   * Dispatches `rich-text:element:register` event.
   *
   * @param core A - MindDrop core instance.
   * @param config - The configuration of the rich text element type to register.
   */
  register<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    config: RTBlockElementConfig<TTypeData> | RTInlineElementConfig<TTypeData>,
  ): void;

  /**
   * Unregisters a rich text element type.
   * Dispatches a `rich-text:element:unregister` event.
   *
   * @param core - A MindDrop core instance.
   * @param type - The type of the rich text element to unregister.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the resource type is not registered.
   */
  unregister<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    config: RTBlockElementConfig<TTypeData> | RTInlineElementConfig<TTypeData>,
  ): void;

  /**
   * Retrieves a rich text element by ID.
   *
   * @param elementId - The ID of the element to retrieve.
   * @returns The requested rich text element.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the rich text element does not exist.
   */
  get<TTypeData extends RTElementTypeData = {}>(
    elementId: string,
  ): RTElement<TTypeData>;

  /**
   * Retrieves rich text elements by ID.
   *
   * Returns a `{ [id]: RTElement }` map of the corresponding rich text elements.
   *
   * @param elementIds - The IDs of the elements to retrieve.
   * @returns A `{ [id]: RichTextElement }` map of the requested rich text elements.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if any of the rich text elements do not exist.
   */
  get<TTypeData extends RTElementTypeData = {}>(
    elementIds: string[],
  ): RTElement<TTypeData>;

  /**
   * Returns all rich text elements as a `{ [id]: RichTextElement }` map.
   */
  getAll<TTypeData extends RTElementTypeData = {}>(): RTElementMap<TTypeData>;

  /**
   * Filters rich text elements according to the provided filters.
   *
   * @param elements - The rich text elements to filter.
   * @param filters - The filtering options.
   * @returns The filtered rich text elements.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if any of the element types are not registered.
   */
  filter<TTypeData extends RTElementTypeData = {}>(
    elements: RTElementMap<TTypeData>,
    filters: RTElementFilters,
  ): RTElementMap<TTypeData>;

  /**
   * Creates a new rich text element of the specified type.
   * Dispatches a `rich-text:element:create` event.
   *
   * Returns the newly created element.
   *
   * @param core - A MindDrop core instance.
   * @param type - The type of element to create.
   * @param data - The element data.
   * @returns The newly created rich text element.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the rich text element type is not registered.
   *
   * @throws ResourceValidationError
   * Thrown if the data is invalid.
   */
  create<TTypeCreateData = {}, TTypeData extends RTElementTypeData = {}>(
    core: Core,
    type: string,
    data: TTypeCreateData,
  ): RTElement<TTypeData>;

  /**
   * Creates a new rich text element of the given type.
   * Dispatches a `rich-text:element:create` event
   *
   * Returns the newly created element.
   *
   * - If creating a 'block' level element from data, the data must be
   *   a `DataInsert`.
   * - If creating an 'inline' level element, the data must be a
   *   `RTFragment`.
   *
   * @param core - A MindDrop core instance.
   * @param type - The element type to create.
   * @param data - The data from which to create the element.
   * @returns The new element.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the rich text element type is not registered.
   *
   * @throws ResourceValidationError
   * Thrown if the data is invalid.
   */
  createFromData<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    type: string,
    data: DataInsert | RTFragment,
  ): RTElement<TTypeData>;

  /**
   * Updates a rich text element. Dispatches a `rich-text:elemet:update`
   * event.
   *
   * Returns the updated element.
   *
   * @param core - A MindDrop core instance.
   * @param elementId - The ID of the element to update.
   * @param data - The changes to apply to the element.
   * @returns The updated element.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the rich text element type is not registered.
   *
   * @throws ResourceValidationError
   * Thrown if the data is invalid.
   */
  update<TTypeUpdateData = {}, TTypeData extends RTElementTypeData = {}>(
    core: Core,
    elementId: string,
    data: TTypeUpdateData,
  ): RTElement<TTypeData>;

  /**
   * Restores a soft-deleted rich text element. Dispatches a
   * `rich-text:element:restore` event.
   *
   * Returns the restored element.
   *
   * @param core - A MindDrop core instance.
   * @param elementId - The ID of the element to restore.
   * @returns The restored element.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  restore<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    elementId: string,
  ): RTElement<TTypeData>;

  /**
   * Soft-deletes a rich text element. Dispatches a
   * `rich-text:element:delete` event.
   *
   * Returns the deleted element.
   *
   * Soft-deleted rich text elements can be restored using
   * the `restore` method.
   *
   * @param core - A MindDrop core instance.
   * @param elementId - The ID of the element to delete.
   * @returns The deleted element.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  delete<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    elementId: string,
  ): RTElement<TTypeData>;

  /**
   * Permanently deletes a rich text element. Dispatches a
   * `rich-text:element:delete-permanently` event.
   *
   * Returns the permanently deleted element.
   *
   * Permanently deleted elements cannot be restored.
   *
   * @param core - A MindDrop core instance.
   * @param elementId - The ID of the element to permanently delete.
   * @returns The permanently deleted element.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the resource document does not exist.
   */
  deletePermanently<TTypeData extends RTElementTypeData = {}>(
    core: Core,
    elementId: string,
  ): RTElement<TTypeData>;

  /**
   * Converts rich text elements to a plain text string.
   * Void elements are converted using their `toPlainText`method.
   * If they do not have such a method, they are omited.
   *
   * @param element - The rich text element(s) to convert to plain text.
   * @returns The plain text.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the any of the element's child rich text elemnts
   * do not exist.
   */
  toPlainText(element: RTElement | RTElement[]): string;

  /**
   * Returns an element's initial data, initialized using the
   * element type config's `initializeData` method if present
   * or an empty object otherwise.
   *
   * @param type - The element type.
   * @param data - The data from which to create the element.
   * @returns The element's creation data.
   *
   * @throws ResourceTypeNotRegisteredError
   * Thrown if the rich text element type is not registered.
   */
  initializeData<TData extends RTElementTypeData>(
    type: string,
    data?: DataInsert | RTFragment,
  ): Partial<RTElement<TData>>;

  /**
   * Converts a rich text block element from one type to another.
   *
   * @param element - The element to convert.
   * @param type - The element type to convert to.
   * @returns The converted element.
   *
   * @throws ResourceTypeNotRegistered
   * Thrown if the current or new element type is not registered
   *
   * @throws InvalidParameterError
   * Thrown if the either the element or the new element type are
   * not 'block' level elements.
   *
   * @throws ResourceValidationError
   * Thrown if the resulting rich text element is invalid.
   */
  convert<TTypeData extends RTElementTypeData = {}>(
    element: RTBlockElement,
    type: string,
  ): RTElement<TTypeData>;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'rich-text-elements:register' event listener
  addEventListener(
    core: Core,
    type: RegisterRTElementEvent,
    callback: RegisterRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterRTElementEvent,
    callback: UnregisterRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:create' event listener
  addEventListener(
    core: Core,
    type: CreateRTElementEvent,
    callback: CreateRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:update' event listener
  addEventListener(
    core: Core,
    type: UpdateRTElementEvent,
    callback: UpdateRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteRTElementEvent,
    callback: DeleteRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreRTElementEvent,
    callback: RestoreRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteRTElementEvent,
    callback: PermanentlyDeleteRTElementEventCallback,
  ): void;

  // Add 'rich-text-elements:load' event listener
  addEventListener(
    core: Core,
    type: LoadRTElementsEvent,
    callback: LoadRTElementsEventCallback,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'rich-text-elements:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterRTElementEvent,
    callback: RegisterRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterRTElementEvent,
    callback: UnregisterRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:create' event listener
  removeEventListener(
    core: Core,
    type: CreateRTElementEvent,
    callback: CreateRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateRTElementEvent,
    callback: UpdateRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteRTElementEvent,
    callback: DeleteRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreRTElementEvent,
    callback: RestoreRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteRTElementEvent,
    callback: PermanentlyDeleteRTElementEventCallback,
  ): void;

  // Remove 'rich-text-elements:load' event listener
  removeEventListener(
    core: Core,
    type: LoadRTElementsEvent,
    callback: LoadRTElementsEventCallback,
  ): void;
}
