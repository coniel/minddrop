import { Core } from '@minddrop/core';
import { TopicFilters } from './TopicFilters.types';
import {
  CreateTopicData,
  Topic,
  TopicMap,
  TopicParentReference,
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
  ClearTopicsEvent,
  ClearTopicsEventCallback,
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
  MoveDropsEvent,
  MoveDropsEventCallback,
} from './TopicEvents.types';
import { TopicViewConfig } from './TopicViewConfig.types';
import { AddDropsMetadata, TopicView, TopicViewMap } from './TopicView.types';
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
  get(topicId: string): Topic | null;
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
   * Returns an `{ [id]: Topic }` map of a given drop's parent topics. The results
   * can be filtered using TopicFilters.
   *
   * @param dropId The ID of the drop for which to retrieve the parent topics.
   * @param filters Filters to filter the parent topics by.
   * @returns A `{ [id]: Topic }` map of the drop's parent topics.
   */
  getDropParentTopics(dropId: string): TopicMap;

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
   * Adds subtopics into a parent topic.
   * Dispatches an `topics:add-subtopics` event, as well
   * as a `topics:update` event.
   *
   * @param core A MindDrop core instance.
   * @param topicId The ID of the topic to which to add the subtopics.
   * @param subtopicIds The IDs of the subtopics to add to the topic.
   * @returns The updated topic.
   */
  addSubtopics(core: Core, topicId: string, subtopicIds: string[]): Topic;

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
   * Moves subtopics from one topic to another and dispaches
   * a `topics:move-subtopics` event.
   *
   * @param core A MindDrop core instance.
   * @param fromTopicId The ID of the topic from which to move the subtopics.
   * @param toTopicId The ID of the topic into which to move the subtopics.
   * @param subtopicIds The IDs of the subtopics to remove.
   */
  moveSubtopics(
    core: Core,
    fromTopicId: string,
    toTopicId: string,
    subtopicIds: string[],
  ): void;

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
    parentReferences: TopicParentReference[],
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
    parentReferences: TopicParentReference[],
  ): Topic;

  /**
   * Returns an `{ [id]: Topic }` map of a given topic's parents. The results
   * can be filtered using TopicFilters.
   *
   * @param topicId The ID of the topic for which to retrieve the parents.
   * @param filters Filters to filter the parents by.
   * @returns A `{ [id]: Topic }` map of the topic's parents.
   */
  getParents(topicId: string, filters?: TopicFilters): TopicMap;

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
   * Returns a TopicView by ID.
   *
   * @param viewId The ID of the topic view to retrieve.
   */
  getView(viewId: string): TopicView;

  /**
   * Returns a `{ [id]: TopicView }` map of all registered topic views.
   */
  getViews(): TopicViewMap;

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
  createViewInstance<I extends TopicViewInstance = TopicViewInstance>(
    core: Core,
    topicId: string,
    topicViewId: string,
  ): I;

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
   * Loads topics into the store and dispatches a `topics:load` event.
   *
   * @param core A MindDrop core instance.
   * @param topics The topics to load.
   */
  load(core: Core, topics: Topic[]): void;

  /**
   * Clears topics from the store and dispatches a `topics:clear` event.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core);

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
  );

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
  );

  // Add topics:remove-parents event listener
  addEventListener(
    core: Core,
    type: RemoveParentsEvent,
    callback: RemoveParentsEventCallback,
  );

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

  // Add 'topics:load' event listener
  addEventListener(
    core: Core,
    type: ClearTopicsEvent,
    callback: ClearTopicsEventCallback,
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
  );

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
  );

  // Remove topics:remove-parents event listener
  removeEventListener(
    core: Core,
    type: RemoveParentsEvent,
    callback: RemoveParentsEventCallback,
  );

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
