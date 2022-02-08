import { ComponentType } from 'react';
import { Core } from '@minddrop/core';
import { UiComponentConfig } from './UiComponentConfig.types';
import { UiLocation } from './UiLocation';
import { OpenViewEvent, OpenViewEventCallback } from './AppEvents.types';
import { SlotProps } from '../Slot';
import {
  AddRootTopicsEvent,
  AddRootTopicsEventCallback,
  RemoveRootTopicsEvent,
  RemoveRootTopicsEventCallback,
} from '.';
import { View, ViewInstance } from '@minddrop/views';
import { CreateTopicData, Topic } from '@minddrop/topics';

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
   * Adds topics to the root level and dispaches an
   * `app:add-root-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param topicIds The IDs of the topics to be added to the root level.
   */
  addRootTopics(core: Core, topicIds: string[]): void;

  /**
   * Opens a topic's view.
   *
   * @param core A MindDrop core instance.
   * @param trail The IDs of the topics leading up to and including the topic to open.
   * @param viewInstanceId The ID of the topic view instance to open.
   */
  openTopicView(core: Core, trail: string[], viewInstanceId?: string): void;

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
}
