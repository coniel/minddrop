import { ComponentType } from 'react';
import {
  TopicChange,
  TopicMove,
  DropAdd,
  DropChange,
  DropMove,
  EventListenerCallback,
} from './EventListener.types';
import { Topic } from './Topic.types';
import { Drop } from './Drop.types';
import { DataInsert } from './DataInsert.types';
import {
  PrimaryNavItemConfig,
  SecondaryNavItemConfig,
  IconButtonConfig,
} from './UIComponentConfig.types';
import { App } from './App.types';
import { ResourceView, View } from './View.types';

export interface ExtensionAppApi extends Pick<App, 'Slot'> {
  /**
   * Creates a new topic, returing the topic.
   *
   * @param data The topic data.
   *
   * @returns The newly created topic.
   */
  createTopic(data?: Partial<Topic>): Topic;

  /**
   * Updates a topic, returning the updated topic.
   *
   * @param id The ID of the topic being updated.
   * @param data Updates to be applied to the topic.
   *
   * @returns The updated topic.
   */
  updateTopic(id: string, data: Partial<Topic>): Topic;

  /**
   * Adds an existing topic into another topic, or to the root level. The topic is *not* removed from its current parent.
   *
   * @param id The ID of the topic to add.
   * @param to The ID of the parent topic into which to add the topic. `null` if adding to the root level.
   */
  addTopic(id: string, to: string | null): void;

  /**
   * Moves a topic into another topic or the root level. The topic *is* removed from its current parent.
   *
   * @param id The ID of the moved topic.
   * @param from The ID of the parent topic from which the topic is being moved, `null` if moving from root level.
   * @param to The ID of the parent topic into which the topic is being moved, `null` if moving to root level.
   */
  moveTopic(id: string, from: string | null, to: string | null): void;

  /**
   * Archives a topic.
   *
   * @param id The ID of the topic to archive.
   */
  archiveTopic(id: string): void;

  /**
   * Deletes a topic. Deleted topics can still be
   * recovered from the trash.
   *
   * @param id The ID of the topic to delete.
   */
  deleteTopic(id: string): void;

  /**
   * Opens a given view.
   *
   * @param view The view to open.
   */
  openView(view: View | ResourceView): void;

  /**
   *
   * @param location The location at which to insert the element.
   * @param element The UI element.
   */
  // Sidebar UI extensions
  extendUi(
    location: 'Sidebar:PrimaryNav:Item',
    element: PrimaryNavItemConfig | ComponentType,
  ): void;
  extendUi(
    location: 'Sidebar:SecondaryNav:Item',
    element: SecondaryNavItemConfig | ComponentType,
  ): void;
  extendUi(
    location: 'Sidebar:BottomToolbar:Item',
    element: IconButtonConfig | ComponentType,
  ): void;

  // Topic UI extensions
  extendUi(
    location: 'Topic:Header:Toolbar:Item',
    element: IconButtonConfig | ComponentType,
  );

  // App event listeners
  addEventListener(
    type: 'load-topics',
    callback: EventListenerCallback<Topic[]>,
  ): void;
  addEventListener(
    type: 'load-drops',
    callback: EventListenerCallback<Drop[]>,
  ): void;
  addEventListener(
    type: 'insert-data',
    callback: EventListenerCallback<DataInsert>,
  ): void;

  // Topic event listeners
  addEventListener(
    type: 'create-topic',
    callback: EventListenerCallback<Topic>,
  ): void;
  addEventListener(
    type: 'update-topic',
    callback: EventListenerCallback<TopicChange>,
  ): void;
  addEventListener(
    type: 'move-topic',
    callback: EventListenerCallback<TopicMove>,
  ): void;
  addEventListener(
    type: 'archive-topic',
    callback: EventListenerCallback<Topic>,
  ): void;
  addEventListener(
    type: 'unarchive-topic',
    callback: EventListenerCallback<Topic>,
  ): void;
  addEventListener(
    type: 'delete-topic',
    callback: EventListenerCallback<Topic>,
  ): void;
  addEventListener(
    type: 'restore-topic',
    callback: EventListenerCallback<Topic>,
  ): void;

  // Drop event listeners
  addEventListener(
    type: 'create-drop',
    callback: EventListenerCallback<DropAdd>,
  ): void;
  addEventListener(
    type: 'update-drop',
    callback: EventListenerCallback<DropChange>,
  ): void;
  addEventListener(
    type: 'move-drop',
    callback: EventListenerCallback<DropMove>,
  ): void;
  addEventListener(
    type: 'archive-drop',
    callback: EventListenerCallback<Drop>,
  ): void;
  addEventListener(
    type: 'unarchive-drop',
    callback: EventListenerCallback<Drop>,
  ): void;
  addEventListener(
    type: 'delete-drop',
    callback: EventListenerCallback<Drop>,
  ): void;
  addEventListener(
    type: 'restore-drop',
    callback: EventListenerCallback<Drop>,
  ): void;

  /**
   * Adds an event listener.
   *
   * @param type The event type to listen to.
   * @param callback The callback fired when the event occurs.
   */
  // Allow extensions to add custom event listeners
  addEventListener(type: string, callback: EventListenerCallback<any>): void;

  /**
   * Dispatches an event.
   *
   * @param type The event type.
   * @param data The data related to the event.
   */
  // App event dispatchers
  dispatch(type: 'load-topics', data: Topic[]): void;
  dispatch(type: 'load-drops', data: Drop[]): void;
  dispatch(type: 'insert-data', data: DataInsert[]): void;

  // Topic event dispatchers
  dispatch(type: 'create-topic', data: Topic): void;
  dispatch(type: 'update-topic', data: TopicChange): void;
  dispatch(type: 'move-topic', data: TopicMove): void;
  dispatch(type: 'archive-topic', data: Topic): void;
  dispatch(type: 'unarchive-topic', data: Topic): void;
  dispatch(type: 'delete-topic', data: Topic): void;
  dispatch(type: 'restore-topic', data: Topic): void;

  // Drop event dispatchers
  dispatch(type: 'create-drop', data: DropAdd): void;
  dispatch(type: 'update-drop', data: DropChange): void;
  dispatch(type: 'move-drop', data: DropMove): void;
  dispatch(type: 'archive-drop', data: Drop): void;
  dispatch(type: 'unarchive-drop', data: Drop): void;
  dispatch(type: 'delete-drop', data: Drop): void;
  dispatch(type: 'restore-drop', data: Drop): void;
}
