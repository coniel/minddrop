import { ComponentType } from 'react';
import { Core, DataInsert } from '@minddrop/core';
import { UiComponentConfig } from './UiComponentConfig.types';
import { UiLocation } from './UiLocation';
import { SlotProps } from '../Slot';
import {
  OpenViewEvent,
  OpenViewEventCallback,
  AddRootTopicsEvent,
  AddRootTopicsEventCallback,
  RemoveRootTopicsEvent,
  RemoveRootTopicsEventCallback,
  UnarchiveRootTopicsEvent,
  UnarchiveRootTopicsEventCallback,
} from './AppEvents.types';
import { View, ViewInstance } from '@minddrop/views';
import { AddDropsMetadata, CreateTopicData, Topic } from '@minddrop/topics';
import { DropMap } from '@minddrop/drops';
import {
  ArchiveRootTopicsEvent,
  ArchiveRootTopicsEventCallback,
  ClearSelectedDropsEvent,
  ClearSelectedDropsEventCallback,
  SelectDropsEvent,
  SelectDropsEventCallback,
  UnselectDropsEvent,
  UnselectDropsEventCallback,
} from '.';

export interface AppApi {
  /**
   * A component which will render UI extensions
   * for a given location.
   */
  Slot: ComponentType<SlotProps>;

  /**
   * Opens a static view in the app and dispatches an `app:open-view` event.
   *
   * @param core A MindDrop core instance.
   * @param viewId The ID of the static view to open.
   */
  openView(core: Core, viewId: string): void;

  /**
   * Opens a view instance in the app and dispatches an `app:open-view` event.
   *
   * @param core A MindDrop core instance.
   * @param viewId The ID of the view instance document to open.
   */
  openViewInstance(core: Core, viewInstanceId: string): void;

  /**
   * Returns a `{ view: View, instance: ViewInstance | null }` map of the currently
   * open view and view instance (`null` if no view instance is open).
   *
   * @returns The currently open view and view instance.
   */
  getCurrentView<I extends ViewInstance = ViewInstance>(): {
    view: View;
    instance: I | null;
  };

  /**
   * Adds a new UI extension for a speficied location.
   *
   * @param core A MindDrop core instance.
   * @param location The location at which to extend the UI.
   * @param element The UI component config or React component with which to extend the UI.
   */
  addUiExtension(
    core: Core,
    location: UiLocation,
    element: UiComponentConfig | ComponentType,
  ): void;

  /**
   * Removes a UI extension.
   *
   * @param location The location for which the extension was added.
   * @param element The added UI component config or React component.
   */
  removeUiExtension(
    location: UiLocation,
    element: UiComponentConfig | ComponentType,
  ): void;

  /**
   * Removes all UI extensions added by the extension.
   * Optionally, a location can be specified to remove
   * UI extensions only from the specified location.
   *
   * @param core A MindDrop core instance.
   * @param location The location from which to remove the UI extensions.
   */
  removeAllUiExtensions(core: Core, location?: UiLocation): void;

  /**
   * Creates a new topic along with a default view for it.
   * Dispatches a `topics:create` event and `views:create`
   * event. Returns the new topic.
   *
   * @param core A MindDrop core instance.
   * @param data The default topic property values.
   * @returns The new topic.
   */
  createTopic(core: Core, data?: CreateTopicData): Topic;

  /**
   * Permanently deletes a topic along with its associated views.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to delete.
   */
  permanentlyDeleteTopic(core: Core, topicId: string): Topic;

  /**
   * Handles data inserts into a topic depending on the insert's `action` parameter:
   * - `insert`: creates drops from the raw data and adds them to the topic
   * - `copy`: data insert's drops are duplicated and duplicates added to the topic
   * - `cut`: data insert's drops are added to the topic (removal from source is
   *    handled at the time of the cut)
   * - `move`: data insert's drops are added to the topic and removed from the
   *    source topic
   * - `add`: data insert's drops are added to the topic
   *
   * Any other action is ignored.
   *
   * Returns a boolean indicating whether or not the data insert was handled
   * (`false` if action is not one of the ones listed above).
   *
   * @param core A MindDrop core instance.
   * @param topicId The topic into which the data is being inserted.
   * @param metadata Optional metadata added by the view instance which invoked the function.
   */
  insertDataIntoTopic<M extends AddDropsMetadata = AddDropsMetadata>(
    core: Core,
    topicId: string,
    data: DataInsert,
    metadata?: M,
  ): Promise<boolean>;

  /**
   * Returns root topics in the order they appear in
   * the sidebar.
   *
   * @returns Root topics as an ordered array.
   */
  getRootTopics(): Topic[];

  /**
   * Adds topics to the root level and dispaches an
   * `app:add-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the topics to add to the root level.
   */
  addRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Removes topics from the root level and dispaches an
   * `app:remove-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the topics to remove from the root level.
   */
  removeRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Returns archived root topics in the order in which
   * they appear in the app sidebar.
   *
   * @returns Archived root topics.
   */
  getArchivedRootTopics(): Topic[];

  /**
   * Archives root level topics and dispatches an
   * `app:archive-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the root level topics to archive.
   */
  archiveRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Unarchives root level topics and dispatches an
   * `app:remove-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the topics to remove from the root level.
   */
  unarchiveRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Opens a topic's view.
   *
   * @param core A MindDrop core instance.
   * @param trail The IDs of the topics leading up to and including the topic to open.
   * @param viewInstanceId The ID of the topic view instance to open.
   */
  openTopicView(core: Core, trail: string[], viewInstanceId?: string): void;

  /**
   * Adds drops to the selected drops list and
   * dispatches a `app:selected-drops` event.
   *
   * @param core A MindDrop core instance.
   * @param dropIds The IDs of the drops to select.
   */
  selectDrops(core: Core, dropIds: string[]): void;

  /**
   * Removes drops from the selected drops list and
   * dispatches a `app:unselected-drops` event.
   *
   * @param core A MindDrop core instance.
   * @param dropIds The IDs of the drops to unselect.
   */
  unselectDrops(core: Core, dropIds: string[]): void;

  /**
   * Returns the currently selected drops.
   *
   * @returns A DropMap of selected drops.
   */
  getSelectedDrops(): DropMap;

  /**
   * Clears the selected drops from the store and
   * dispatches a `app:clear-selected-drops` event.
   *
   * @param core A MindDrop core instance.
   */
  clearSelectedDrops(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'app:open-view' event listener
  addEventListener(
    core: Core,
    event: OpenViewEvent,
    callback: OpenViewEventCallback,
  );

  // Add 'app:add-root-topics' event listener
  addEventListener(
    core: Core,
    event: AddRootTopicsEvent,
    callback: AddRootTopicsEventCallback,
  );

  // Add 'app:remove-root-topics' event listener
  addEventListener(
    core: Core,
    event: RemoveRootTopicsEvent,
    callback: RemoveRootTopicsEventCallback,
  );

  // Add 'app:unarchive-root-topics' event listener
  addEventListener(
    core: Core,
    event: UnarchiveRootTopicsEvent,
    callback: UnarchiveRootTopicsEventCallback,
  );

  // Add 'app:archive-root-topics' event listener
  addEventListener(
    core: Core,
    event: ArchiveRootTopicsEvent,
    callback: ArchiveRootTopicsEventCallback,
  );

  // Add 'app:select-drops' event listener
  addEventListener(
    core: Core,
    event: SelectDropsEvent,
    callback: SelectDropsEventCallback,
  );

  // Add 'app:unselect-drops' event listener
  addEventListener(
    core: Core,
    event: UnselectDropsEvent,
    callback: UnselectDropsEventCallback,
  );

  // Add 'app:clear-selected-drops' event listener
  addEventListener(
    core: Core,
    event: ClearSelectedDropsEvent,
    callback: ClearSelectedDropsEventCallback,
  );

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'app:open-view' event listener
  removeEventListener(
    core: Core,
    type: OpenViewEvent,
    callback: OpenViewEventCallback,
  ): void;

  // Remove 'app:add-root-topics' event listener
  removeEventListener(
    core: Core,
    event: AddRootTopicsEvent,
    callback: AddRootTopicsEventCallback,
  );

  // Remove 'app:remove-root-topics' event listener
  removeEventListener(
    core: Core,
    event: RemoveRootTopicsEvent,
    callback: RemoveRootTopicsEventCallback,
  );

  // Remove 'app:remove-root-topics' event listener
  removeEventListener(
    core: Core,
    event: RemoveRootTopicsEvent,
    callback: RemoveRootTopicsEventCallback,
  );

  // Remove 'app:unarchive-root-topics' event listener
  removeEventListener(
    core: Core,
    event: UnarchiveRootTopicsEvent,
    callback: UnarchiveRootTopicsEventCallback,
  );

  // Remove 'app:select-drops' event listener
  removeEventListener(
    core: Core,
    event: SelectDropsEvent,
    callback: SelectDropsEventCallback,
  );

  // Remove 'app:unselect-drops' event listener
  removeEventListener(
    core: Core,
    event: UnselectDropsEvent,
    callback: UnselectDropsEventCallback,
  );

  // Remove 'app:clear-selected-drops' event listener
  removeEventListener(
    core: Core,
    event: ClearSelectedDropsEvent,
    callback: ClearSelectedDropsEventCallback,
  );
}
