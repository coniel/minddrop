import { Core } from '@minddrop/core';
import { ResourceReference, ResourceApi } from '@minddrop/resources';
import { ViewInstanceTypeData } from '@minddrop/views';
import { TopicFilters } from './TopicFilters.types';
import {
  CreateTopicData,
  Topic,
  TopicMap,
  UpdateTopicData,
} from './Topic.types';
import {
  CreateTopicEvent,
  UpdateTopicEvent,
  DeleteTopicEvent,
  RestoreTopicEvent,
  AddSubtopicsEvent,
  AddDropsEvent,
  AddTagsEvent,
  RemoveSubtopicsEvent,
  RemoveDropsEvent,
  RemoveTagsEvent,
  LoadTopicsEvent,
  InsertDataEvent,
  AddDropsEventCallback,
  AddSubtopicsEventCallback,
  AddTagsEventCallback,
  CreateTopicEventCallback,
  DeleteTopicEventCallback,
  InsertDataEventCallback,
  LoadTopicsEventCallback,
  RemoveDropsEventCallback,
  RemoveSubtopicsEventCallback,
  RemoveTagsEventCallback,
  RestoreTopicEventCallback,
  UpdateTopicEventCallback,
  PermanentlyDeleteTopicEventCallback,
  PermanentlyDeleteTopicEvent,
  RegisterViewEvent,
  RegisterViewEventCallback,
  UnregisterViewEvent,
  UnregisterViewEventCallback,
  CreateViewInstanceEvent,
  CreateViewInstanceEventCallback,
  DeleteViewInstanceEventCallback,
  DeleteViewInstanceEvent,
  ArchiveDropsEvent,
  ArchiveDropsEventCallback,
  UnarchiveDropsEvent,
  UnarchiveDropsEventCallback,
  AddParentsEvent,
  AddParentsEventCallback,
  RemoveParentsEvent,
  RemoveParentsEventCallback,
  MoveSubtopicsEvent,
  MoveSubtopicsEventCallback,
  SortSubtopicsEvent,
  SortSubtopicsEventCallback,
  MoveDropsEvent,
  MoveDropsEventCallback,
} from './TopicEvents.types';
import { AddDropsMetadata, TopicViewConfig } from './TopicViewConfig.types';
import { TopicViewInstance } from './TopicViewInstance.types';
import { AddDropMetadata } from '../addDropsToTopic';

export interface TopicsApi {
  /**
   * Retrieves one or more topics by ID.
   *
   * If provided a single ID string, returns the topic.
   *
   * If provided an array of IDs, returns a `{ [id]: Topic }` map of the corresponding topics.
   * Topics can be filtered by passing in TopicFilters. Filtering is not supported when getting a single topic.
   *
   * @param ids An array of topic IDs to retrieve.
   * @param filters Filters to filter to the topics by, only supported when getting multiple topics.
   * @returns The requested topic(s).
   */
  get(topicId: string): Topic;
  get(topicIds: string[], filters?: TopicFilters): TopicMap;

  /**
   * Retrieves all topics from the topics store as a `{ [id]: Topic }` map.
   * Topics can be filtered by passing in TopicFilters.
   *
   * @param filters Filters to filter to the topics by.
   * @returns A `{ [id]: Topic }` map.
   */
  getAll(filters?: TopicFilters): TopicMap;

  /**
   * Filters topics by active and deleted state.
   * If no filters are set, returns active topics.
   * If deleted filters is `true`, active topics are
   * not included unless specifically set to `true`.
   *
   * @param topics The topics to filter.
   * @param filters The filters by which to filter the topics.
   * @returns The filtered topics.
   */
  filter(topics: TopicMap, filters: TopicFilters): TopicMap;

  /**
   * Checks whether a topic is a descendant of other topics.
   * A descendant topic can be nested multiple layers deeep
   * inside a parent topic.
   *
   * @param descendantTopicId - The ID of the topic which may be a descendant.
   * @param parentTopicIds - The IDs of the topics which may be a parent.
   * @returns A boolean indicating whether the topic is a descendant.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the topic or any of the potential parent
   * topics do not exist.
   */
  isDescendant(descendantTopicId: string, parentTopicIds: string[]): boolean;

  /**
   * Creates a new topic and dispatches a `topics:create` event.
   * Returns the new topic.
   *
   * @param core A MindDrop core instance.
   * @param data The default topic property values.
   * @returns The newly created topic.
   */
  create(core: Core, data?: CreateTopicData): Topic;

  /**
   * Applies data changes to a topic and dispatches a
   * `topics:update` event. Returns the updated topic.
   *
   * @param core A MindDrop core instance.
   * @param id The ID of the topic to update.
   * @param data The changes to apply to the topic.
   * @returns The updated topic.
   */
  update(core: Core, id: string, data: UpdateTopicData): Topic;

  /**
   * Deletes a topic and dispatches a `topics:delete`
   * event and an `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to delete.
   * @returns The deleted topic.
   */
  delete(core: Core, topicId: string): Topic;

  /**
   * Restores a deleted topic and dispatches a
   * `topics:restore` event and an `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to restore.
   * @returns The restored topic.
   */
  restore(core: Core, topicId: string): Topic;

  /**
   * Permanently deletes a topic and dispatches a
   * `topics:delete-permanently` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to delete permanently.
   * @retuns The deleted topic.
   */
  deletePermanently(core: Core, topicId: string): Topic;

  /**
   * Normalizes a topic, removing any references to documents
   * (such as drops) which do not exist.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to normalize.
   */
  normalize(core: Core, topicId: string): void;

  /**
   * Adds subtopics into a parent topic.
   * Dispatches an `topics:topic:add-subtopics` event
   *
   * Returns the updated topic.
   *
   * @param core - A MindDrop core instance.
   * @param topicId - The ID of the topic to which to add the subtopics.
   * @param subtopicIds - The IDs of the subtopics to add to the topic.
   * @param position - The index at which to add the subtopics.
   * @returns The updated topic.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the topic does not exist.
   *
   * @throws ResourceValidationError
   * Thrown if any of the subtopics do not exist.
   */
  addSubtopics(
    core: Core,
    topicId: string,
    subtopicIds: string[],
    position?: number,
  ): Topic;

  /**
   * Removes subtopics from a parent topic.
   * Dispatches an `topics:remove-subtopics` event, as well
   * as a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic from which to remove the subtopics.
   * @param subtopicIds The IDs of the subtopics to remove from the topic.
   * @returns The updated topic.
   */
  removeSubtopics(core: Core, topicId: string, subtopicIds: string[]): Topic;

  /**
   * Moves subtopics from one topic to another.
   * Dispatches a `topics:topic:move-subtopics` event.
   *
   * @param core - A MindDrop core instance.
   * @param fromTopicId - The ID of the topic from which to move the subtopics.
   * @param toTopicId - The ID of the topic into which to move the subtopics.
   * @param subtopicIds - The IDs of the subtopics to remove.
   * @param position - The index at which to add the subtopics.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the topic does not exist.
   *
   * @throws ResourceValidationError
   * Thrown if any of the subtopics do not exist.
   */
  moveSubtopics(
    core: Core,
    fromTopicId: string,
    toTopicId: string,
    subtopicIds: string[],
    position?: number,
  ): void;

  /**
   * Sets a new sort order for a topic's subtopics.
   * The provided subtopic IDs must contain the same
   * IDs as the current value, only in a different order.
   * Dispatches a `topics:topic:sort-subtopics` event.
   * Retruns the updated topic.
   *
   * @param core - A MindDrop core instance.
   * @param topicId - The ID of the topic in which to sort the subtopics.
   * @param subtopicIds - The IDs of the subtopics in their new sort order.
   *
   * @throws InvalidParameterError
   * Thrown if the given subtopic IDs differ from the
   * current subtopic IDs in anything but order.
   */
  sortSubtopics(core: Core, topicId: string, subtopicIds: string[]): Topic;

  /**
   * Archives the specified subtopics in a topic and dispatches
   * a `topics:archive-subtopics` event.
   * Returns the updated topic.
   *
   * @param core A MindSubtopic core instance.
   * @param topicId The ID of the topic on which to archive the subtopics.
   * @param subtopicIds The IDs of the subtopics to archive.
   * @returns The updated topic.
   */
  archiveSubtopics(core: Core, topicId: string, subtopicIds: string[]): Topic;

  /**
   * Unarchives the specified subtopics in a topic and dispatches
   * a `topics:unarchive-subtopics` event.
   * Returns the updated topic.
   *
   * @param core A MindSubtopic core instance.
   * @param topicId The ID of the topic on which to unarchive the subtopics.
   * @param subtopicIds The IDs of the subtopics to unarchive.
   * @returns The updated topic.
   */
  unarchiveSubtopics(core: Core, topicId: string, subtopicIds: string[]): Topic;

  /**
   * Adds drops to a topic and dispatches a `topics:add-drops` event
   * and a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to which to add the drops.
   * @param dropIds The IDs of the drops to add to the topic.
   * @param metadata Optional metadata added by the view instance which invoked the function.
   * @returns The updated topic.
   */
  addDrops<M extends AddDropMetadata = AddDropMetadata>(
    core: Core,
    topicId: string,
    dropIds: string[],
    metadata?: M,
  ): Topic;

  /**
   * Moves drops from one topic to another by removing them
   * from the source topic and adding them to the target topic.
   *
   * @param core A MindDrop core instance.
   * @param fromTopicId The ID of the topic from which to move the drops.
   * @param toTopicId The ID of the topic to which to move the drops.
   * @param dropIds The IDs of the drops to move.
   */
  moveDrops(
    core: Core,
    fromTopicId: string,
    toTopicId: string,
    dropIds: string[],
    metadata?: AddDropsMetadata,
  ): void;

  /**
   * Removes drops from a topic and dispatches a `topics:remove-drops` event
   * and a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic from which to remove the drops.
   * @param dropIds The IDs of the drops to remove.
   * @returns The updated topic.
   */
  removeDrops(core: Core, topicId: string, dropIds: string[]): Topic;

  /**
   * Archives the specified drops in a topic and dispatches
   * a `topics:archive-drops` event.
   * Returns the updated topic.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic on which to archive the drops.
   * @param dropIds The IDs of the drops to archive.
   * @returns The updated topic.
   */
  archiveDrops(core: Core, topicId: string, dropIds: string[]): Topic;

  /**
   * Unarchives the specified drops in a topic and dispatches
   * a `topics:unarchive-drops` event.
   * Returns the updated topic.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic on which to unarchive the drops.
   * @param dropIds The IDs of the drops to unarchive.
   * @returns The updated topic.
   */
  unarchiveDrops(core: Core, topicId: string, dropIds: string[]): Topic;

  /**
   * Adds parent references to a topic and dispatches a
   * `topics:add-parents` event.
   *
   * @param core A MindTopic core instance.
   * @param topicId The ID of the topic to which to add the parents.
   * @param parentReferences The parent references to add.
   */
  addParents(
    core: Core,
    topicId: string,
    parentReferences: ResourceReference[],
  ): Topic;

  /**
   * Removes parent references from a topic and dispatches a
   * `topics:remove-parents` event.
   *
   * @param core A MindTopic core instance.
   * @param topicId The ID of the topic from which to remove the parents.
   * @param parentReferences The parent references to remove.
   */
  removeParents(
    core: Core,
    topicId: string,
    parentReferences: ResourceReference[],
  ): Topic;

  /**
   * Adds tags to a topic and dispatches a `topics:add-tags` event
   * and a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to which to add the tags.
   * @param tagIds The IDs of the tags to add to the topic.
   * @returns The updated topic.
   */
  addTags(core: Core, topicId: string, tagIds: string[]): Topic;

  /**
   * Removes tags from a topic and dispatches a `topics:remove-tags` event
   * and a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic from which to remove the tags.
   * @param tagIds The IDs of the tags to remove.
   * @returns The updated topic.
   */
  removeTags(core: Core, topicId: string, tagIds: string[]): Topic;

  /**
   * Returns a topic view's config by ID.
   *
   * @param viewId - The ID of the topic view config to retrieve.
   */
  getViewConfig(viewId: string): TopicViewConfig;

  /**
   * Returns a `{ [id]: TopicViewConfig }` map of all registered topic views.
   */
  getAllViewConfigs(): Record<string, TopicViewConfig>;

  /**
   * Registers a topic view and dispatches a `topics:register-view` event.
   *
   * @param core A MindDrop core instance.
   * @param config The config of the topic view to register.
   */
  registerView(core: Core, config: TopicViewConfig): void;

  /**
   * Unregisters a topic view and dispatches a
   * `topics:unregister-view` event.
   *
   * @param core A MindDrop core instance.
   * @param viewId The ID of the view to unregister.
   */
  unregisterView(core: Core, viewId: string): void;

  /**
   * Creates a new instance of a TopicView and adds it to the topic.
   * The topic view must first be registered using `Topics.registerView`
   * or else a TopicViewNotRegisteredError will be thrown.
   *
   * Returns the new view instance and dispatches a
   * `topics:create-view-instance` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to which to add the view.
   * @param topicViewId The ID of the topic view for which to create an instance.
   */
  createViewInstance<TTypeData extends ViewInstanceTypeData = {}>(
    core: Core,
    topicId: string,
    topicViewId: string,
  ): TopicViewInstance<TTypeData>;

  /**
   * Deletes a topic view instance and removes it from the topic.
   * Returns the deleted view instance and dispatches a
   * `topics:delete-view-instance` event.
   *
   * @param core A MindDrop core instance.
   * @param viewInstanceId The ID of the topic view instance to delete.
   */
  deleteViewInstance(core: Core, viewInstanceId: string): TopicViewInstance;

  /**
   * The topics resource store.
   */
  store: ResourceApi['store'];

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'topics:create' event listener
  addEventListener(
    core: Core,
    type: CreateTopicEvent,
    callback: CreateTopicEventCallback,
  ): void;

  // Add 'topics:update' event listener
  addEventListener(
    core: Core,
    type: UpdateTopicEvent,
    callback: UpdateTopicEventCallback,
  ): void;

  // Add 'topics:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteTopicEvent,
    callback: DeleteTopicEventCallback,
  ): void;

  // Add 'topics:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreTopicEvent,
    callback: RestoreTopicEventCallback,
  ): void;

  // Add 'topics:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteTopicEvent,
    callback: PermanentlyDeleteTopicEventCallback,
  ): void;

  // Add 'topics:add-subtopics' event listener
  addEventListener(
    core: Core,
    type: AddSubtopicsEvent,
    callback: AddSubtopicsEventCallback,
  ): void;

  // Remove 'topics:remove-subtopics' event listener
  addEventListener(
    core: Core,
    type: RemoveSubtopicsEvent,
    callback: RemoveSubtopicsEventCallback,
  ): void;

  // Add 'topics:move-topics' event listener
  addEventListener(
    core: Core,
    type: MoveSubtopicsEvent,
    callback: MoveSubtopicsEventCallback,
  ): void;

  // Add 'topics:topic:sort-subtopics' event listener
  addEventListener(
    core: Core,
    type: SortSubtopicsEvent,
    callback: SortSubtopicsEventCallback,
  ): void;

  // Add 'topics:add-drops' event listener
  addEventListener(
    core: Core,
    type: AddDropsEvent,
    callback: AddDropsEventCallback,
  ): void;

  // Add 'topics:archive-drops' event listener
  addEventListener(
    core: Core,
    type: ArchiveDropsEvent,
    callback: ArchiveDropsEventCallback,
  ): void;

  // Add 'topics:unarchive-drops' event listener
  addEventListener(
    core: Core,
    type: UnarchiveDropsEvent,
    callback: UnarchiveDropsEventCallback,
  ): void;

  // Add 'topics:remove-drops' event listener
  addEventListener(
    core: Core,
    type: RemoveDropsEvent,
    callback: RemoveDropsEventCallback,
  ): void;

  // Add 'topics:move-drops' event listener
  addEventListener(
    core: Core,
    type: MoveDropsEvent,
    callback: MoveDropsEventCallback,
  ): void;

  // Add topics:add-parents event listener
  addEventListener(
    core: Core,
    type: AddParentsEvent,
    callback: AddParentsEventCallback,
  ): void;

  // Add topics:remove-parents event listener
  addEventListener(
    core: Core,
    type: RemoveParentsEvent,
    callback: RemoveParentsEventCallback,
  ): void;

  // Add 'topics:add-tags' event listener
  addEventListener(
    core: Core,
    type: AddTagsEvent,
    callback: AddTagsEventCallback,
  ): void;

  // Add 'topics:remove-tags' event listener
  addEventListener(
    core: Core,
    type: RemoveTagsEvent,
    callback: RemoveTagsEventCallback,
  ): void;

  // Add 'topics:register-view' event listener
  addEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Add 'topics:unregister-view' event listener
  addEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;

  // Add 'topics:create-view-instance' event listener
  addEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Add 'topics:delete-view-instance' event listener
  addEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Add 'topics:insert-data' event listener
  addEventListener(
    core: Core,
    type: InsertDataEvent,
    callback: InsertDataEventCallback,
  ): void;

  // Add 'topics:load' event listener
  addEventListener(
    core: Core,
    type: LoadTopicsEvent,
    callback: LoadTopicsEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'topics:create' event listener
  removeEventListener(
    core: Core,
    type: CreateTopicEvent,
    callback: CreateTopicEventCallback,
  ): void;

  // Remove 'topics:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateTopicEvent,
    callback: UpdateTopicEventCallback,
  ): void;

  // Remove 'topics:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteTopicEvent,
    callback: DeleteTopicEventCallback,
  ): void;

  // Remove 'topics:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreTopicEvent,
    callback: RestoreTopicEventCallback,
  ): void;

  // Remove 'topics:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteTopicEvent,
    callback: PermanentlyDeleteTopicEventCallback,
  ): void;

  // Remove 'topics:add-subtopics' event listener
  removeEventListener(
    core: Core,
    type: AddSubtopicsEvent,
    callback: AddSubtopicsEventCallback,
  ): void;

  // Remove 'topics:remove-subtopics' event listener
  removeEventListener(
    core: Core,
    type: RemoveSubtopicsEvent,
    callback: RemoveSubtopicsEventCallback,
  ): void;

  // Remove 'topics:move-topics' event listener
  removeEventListener(
    core: Core,
    type: MoveSubtopicsEvent,
    callback: MoveSubtopicsEventCallback,
  ): void;

  // Remove 'topics:topic:sort-subtopics' event listener
  removeEventListener(
    core: Core,
    type: SortSubtopicsEvent,
    callback: SortSubtopicsEventCallback,
  ): void;

  // Remove 'topics:add-drops' event listener
  removeEventListener(
    core: Core,
    type: AddDropsEvent,
    callback: AddDropsEventCallback,
  ): void;

  // Remove 'topics:archive-drops' event listener
  removeEventListener(
    core: Core,
    type: ArchiveDropsEvent,
    callback: ArchiveDropsEventCallback,
  ): void;

  // Remove 'topics:unarchive-drops' event listener
  removeEventListener(
    core: Core,
    type: UnarchiveDropsEvent,
    callback: UnarchiveDropsEventCallback,
  ): void;

  // Remove 'topics:remove-drops' event listener
  removeEventListener(
    core: Core,
    type: RemoveDropsEvent,
    callback: RemoveDropsEventCallback,
  ): void;

  // Remove 'topics:move-drops' event listener
  removeEventListener(
    core: Core,
    type: MoveDropsEvent,
    callback: MoveDropsEventCallback,
  ): void;

  // Remove topics:add-parents event listener
  removeEventListener(
    core: Core,
    type: AddParentsEvent,
    callback: AddParentsEventCallback,
  ): void;

  // Remove topics:remove-parents event listener
  removeEventListener(
    core: Core,
    type: RemoveParentsEvent,
    callback: RemoveParentsEventCallback,
  ): void;

  // Remove 'topics:add-tags' event listener
  removeEventListener(
    core: Core,
    type: AddTagsEvent,
    callback: AddTagsEventCallback,
  ): void;

  // Remove 'topics:remove-tags' event listener
  removeEventListener(
    core: Core,
    type: RemoveTagsEvent,
    callback: RemoveTagsEventCallback,
  ): void;

  // Remove 'topics:register-view' event listener
  removeEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Remove 'topics:unregister-view' event listener
  removeEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;

  // Remove 'topics:create-view-instance' event listener
  removeEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Remove 'topics:delete-view-instance' event listener
  removeEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Remove 'topics:load' event listener
  removeEventListener(
    core: Core,
    type: LoadTopicsEvent,
    callback: LoadTopicsEventCallback,
  ): void;

  // Remove 'topics:insert-data' event listener
  removeEventListener(
    core: Core,
    type: InsertDataEvent,
    callback: InsertDataEventCallback,
  ): void;
}
