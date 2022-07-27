import { Core, DataInsert, DataInsertAction } from '@minddrop/core';
import { ResourceDocument, ResourceReference } from '@minddrop/resources';
import { SelectionItem } from './SelectionItem.types';

export interface SelectionApi {
  /**
   * Returns the current selection as a SelectionItem array.
   * Optionally, one or more resource types can be passed in to
   * retrieve only selection items matching the resource types.
   *
   * @param resourceType - The resource type(s) of the selection items to retrieve.
   * @returns An array of selection items.
   */
  get(resourceType?: string | string[]): SelectionItem[];

  /**
   * Returns the IDs of items in the current selection
   * as a array. Optionally, one or more resource types
   * can be passed in to retrieve only IDs of selection
   * items matching the resource types.
   *
   * @param resourceType - The resource type(s) of the selection items for which to retrieve the IDs.
   * @returns An array of IDs.
   */
  getIds(resourceType?: string | string[]): string[];

  /**
   * Returns the selection items contained in by DataInsert.
   *
   * Optionally, one or more resource types can be passed
   * in to retrieve only selection items matching the
   * resource types.
   *
   * @param dataInsert - The data insert from which to retrieve selection items.
   * @param resource - The resource type(s) of the selection items to retrieve.
   * @returns An array of selection items.
   */
  getFromDataInsert(dataInsert: DataInsert, resource?: string): SelectionItem[];

  /**
   * Returns a boolean indicating whether or not
   * the given item is currently selected.
   *
   * @param item - The item for which to check the selected state.
   * @returns A boolean indicating the selected state.
   */
  isSelected(item: SelectionItem): boolean;

  /**
   * Returns a boolean indicating whether the given selection items
   * contain resources of the given type(s).
   *
   * @param selectionItems - The array of selection items in which to check.
   * @param resourceType - The resource type(s) of the selection items to check for.
   * @param exclusive - When `true`, the hook will only return true if the selection contains nothing but items of the given type(s).
   * @reutrns A boolean indicating whether resources of the given type are selected.
   */
  contains(
    selectionItems: SelectionItem[],
    resourceType: string | string[],
    exclusive?: boolean,
  ): boolean;

  /**
   * Returns a boolean indicating whether or not the selection is empty.
   *
   * @returns A boolean indicating whether the selection is empty.
   */
  isEmpty(): boolean;

  /**
   * Filters the given selection items by one or more
   * resource types.
   *
   * @param items - The selection items to filter.
   * @param resourceType - The resource type(s) to filter by.
   * @returns An array of selection items.
   */
  filter(
    items: SelectionItem[],
    resourceType: string | string[],
  ): SelectionItem[];

  /**
   * Generates a `SelectionItem` given a resource document
   * or resource reference, and optionally a parent resource
   * document or resource reference.
   *
   * @param resource - The resource document for which to generate a selection item.
   * @param parent - The parent resource document inside which the selection item located.
   * @returns A selection item.
   */
  item(
    resource: ResourceDocument | ResourceReference,
    parent?: ResourceDocument | ResourceReference,
  ): SelectionItem;

  /**
   * Adds the provided items to the current selection.
   * Dispatches a `selection:items:add` event.
   *
   * @param core - A MindDrop core instance.
   * @param items - The selection items to add to the selection.
   */
  add(core: Core, items: SelectionItem[]): void;

  /**
   * Removes the provided items from the current selection.
   * Dispatches a `selection:items:remove` event.
   *
   * @param core - A MindDrop core instance.
   * @param items - The selection items to remove from the current selection.
   */
  remove(core: Core, items: SelectionItem[]): void;

  /**
   * Exclusively selects the provided items, clearing the current selection.
   * Dispatches as a selection:add event as well as a selection:remove event
   * if there were any selected items when the method was called.
   *
   * @param core - A MindDrop core instance.
   * @param items - The selection items of the items to select.
   */
  select(core: Core, items: SelectionItem[]): void;

  /**
   * Clears the current selection and resets the dragging state.
   * Dispatches a `selection:items:remove` event.
   *
   * @param core - A MindDrop core instance.
   */
  clear(core: Core): void;

  /**
   * Sets the current selection as a drag event's data transfer data.
   *
   * The data consists of stringified arrays of selection items grouped
   * by resource, with each resource being set as
   * `minddrop-selection/[resource]`.
   *
   * @param core - A MindDrop core instance.
   * @param event - The drag event for which to set the data.
   * @param action - The data transfer action to assign to the event.
   */
  dragStart(
    core: Core,
    event: DragEvent | React.DragEvent,
    action: DataInsertAction,
  ): void;

  /**
   * Toggles the dragging state to `false`. Dispatches a
   * `selection:drag:end` event.
   *
   * @param core - A MindDrop core instance.
   * @param event - The drag end event.
   */
  dragEnd(core: Core, event: DragEvent | React.DragEvent): void;

  /**
   * Sets the current selection as a clipboard event's data.
   * The data consists of stringified arrays of selection
   * items grouped by resource, with each resource being set
   * as `minddrop-selection/[resource]`.
   *
   * Dispatches a `selection:clipboard:copy` event.
   *
   * @param core - A MindDrop core instance.
   * @param event - The clipboard event.
   */
  copy(core: Core, event: ClipboardEvent | React.ClipboardEvent): void;

  /**
   * Sets the current selection as a clipboard event's data.
   * The data consists of stringified arrays of selection
   * items grouped by resource, with each resource being set
   * as `minddrop-selection/[resource]`.
   *
   * Dispatches a `selection:clipboard:cut` event.
   *
   * @param core - A MindDrop core instance.
   * @param event - The clipboard event.
   */
  cut(core: Core, event: ClipboardEvent | React.ClipboardEvent): void;
}
