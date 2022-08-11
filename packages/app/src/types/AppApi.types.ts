import { ComponentType } from 'react';
import { Core, DataInsert } from '@minddrop/core';
import { ResourceReference } from '@minddrop/resources';
import {
  ViewConfig,
  ViewInstance,
  ViewInstanceTypeData,
} from '@minddrop/views';
import { AddDropsMetadata, CreateTopicData, Topic } from '@minddrop/topics';
import { Drop, DropTypeConfig } from '@minddrop/drops';
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
  MoveRootTopicsEvent,
  MoveRootTopicsEventCallback,
  ArchiveRootTopicsEvent,
  ArchiveRootTopicsEventCallback,
} from './AppEvents.types';

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
  getCurrentView<TData extends ViewInstanceTypeData = {}>(): {
    view: ViewConfig;
    instance: ViewInstance<TData> | null;
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
  ): boolean;

  /**
   * Returns root topics in the order they appear in
   * the sidebar.
   *
   * @returns Root topics as an ordered array.
   */
  getRootTopics(): Topic[];

  /**
   * Adds topics to the root level and dispaches an
   * `app:root-topics:add` event.
   *
   * @param core - A MindDrop core instance.
   * @param topicIds - The IDs of the topics to add to the root level.
   * @param position - The position (index) at which to add the topics.
   */
  addRootTopics(core: Core, topicIds: string[], position?: number): void;

  /**
   * Removes topics from the root level and dispaches an
   * `app:remove-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the topics to remove from the root level.
   */
  removeRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Sets a new sort order for root topics.
   * The provided root topic IDs must contain the same
   * IDs as the current value, only in a different order.
   * Dispatches a `app:root-topics:sort` event.
   *
   * @param core - A MindDrop core instance.
   * @param topicIds - The IDs of the root topics in their new sort order.
   *
   * @throws InvalidParameterError
   * Thrown if the given topic IDs differ from the
   * current root topic IDs in anything but order.
   */
  sortRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Removes subtopics from a parent topic and adds them to the
   * root level. Dispatches a `app:move-subtopics-root` event.
   *
   * @param core A MindDrop core instance.
   * @param parentTopicId The ID of the parent topic containg the subtopics.
   * @param subtopicIds The IDs of the subtopics to move to the root level.
   */
  moveSubtopicsToRoot(
    core: Core,
    parentTopicId: string,
    subtopicIds: string[],
  ): void;

  /**
   * Removes topics from the root level and adds them as
   * subtopics into a specified topic.
   * Dispatches a `app:root-topics:move` event.
   *
   * @param core - A MindDrop core instance.
   * @param toTopicId - The ID of the topic into which to move the topics.
   * @param topicIds - The IDs of the root level topics to move.
   * @param position - The index at which to add the subtopics.
   */
  moveRootTopicsToParentTopic(
    core: Core,
    toTopicId: string,
    topicIds: string[],
    position?: number,
  ): void;

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
   * Returns the drop configs for the drop types enabled
   * on the given topic.
   *
   * @param topicId - The ID of the topic for which to retrieve the drop configs.
   * @returns An array of drop confiogs.
   */
  getTopicDropConfigs(topicId: string): DropTypeConfig[];

  /**
   * Opens a topic's view.
   *
   * @param core A MindDrop core instance.
   * @param trail The IDs of the topics leading up to and including the topic to open.
   * @param viewInstanceId The ID of the topic view instance to open.
   */
  openTopicView(core: Core, trail: string[], viewInstanceId?: string): void;

  /**
   * Renders a drop using the appropriate component.
   *
   * @param drop The drop to render.
   * @param parent The `DropParentReference` of the parent inside which the drop is being rendered.
   * @returns The rendered drop element.
   */
  renderDrop(drop: Drop, parent?: ResourceReference): React.ReactElement;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'app:view:open' event listener
  addEventListener(
    core: Core,
    event: OpenViewEvent,
    callback: OpenViewEventCallback,
  ): void;

  // Add 'app:root-topics:add' event listener
  addEventListener(
    core: Core,
    event: AddRootTopicsEvent,
    callback: AddRootTopicsEventCallback,
  ): void;

  // Add 'app:root-topics:remove' event listener
  addEventListener(
    core: Core,
    event: RemoveRootTopicsEvent,
    callback: RemoveRootTopicsEventCallback,
  ): void;

  // Add 'app:root-topics:move' event listener
  addEventListener(
    core: Core,
    event: MoveRootTopicsEvent,
    callback: MoveRootTopicsEventCallback,
  ): void;

  // Add 'app:root-topics:unarchive' event listener
  addEventListener(
    core: Core,
    event: UnarchiveRootTopicsEvent,
    callback: UnarchiveRootTopicsEventCallback,
  ): void;

  // Add 'app:root-topics:archive' event listener
  addEventListener(
    core: Core,
    event: ArchiveRootTopicsEvent,
    callback: ArchiveRootTopicsEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'app:view:open' event listener
  removeEventListener(
    core: Core,
    type: OpenViewEvent,
    callback: OpenViewEventCallback,
  ): void;

  // Remove 'app:root-topics:add' event listener
  removeEventListener(
    core: Core,
    event: AddRootTopicsEvent,
    callback: AddRootTopicsEventCallback,
  ): void;

  // Remove 'app:root-topics:remove' event listener
  removeEventListener(
    core: Core,
    event: RemoveRootTopicsEvent,
    callback: RemoveRootTopicsEventCallback,
  ): void;

  // Remove 'app:root-topics:move' event listener
  removeEventListener(
    core: Core,
    event: MoveRootTopicsEvent,
    callback: MoveRootTopicsEventCallback,
  ): void;

  // Remove 'app:root-topics:archive' event listener
  removeEventListener(
    core: Core,
    event: ArchiveRootTopicsEvent,
    callback: ArchiveRootTopicsEventCallback,
  ): void;

  // Remove 'app:root-topics:unarchive' event listener
  removeEventListener(
    core: Core,
    event: UnarchiveRootTopicsEvent,
    callback: UnarchiveRootTopicsEventCallback,
  ): void;
}
