import { Core } from '@minddrop/core';
import {
  ClearExtensionsEvent,
  ClearExtensionsEventCallback,
  DisableExtensionOnTopicsEvent,
  DisableExtensionOnTopicsEventCallback,
  EnableExtensionOnTopicsEvent,
  EnableExtensionOnTopicsEventCallback,
  RegisterExtensionEvent,
  RegisterExtensionEventCallback,
  UnregisterExtensionEvent,
  UnregisterExtensionEventCallback,
} from './ExtensionEvents.types';
import { Extension } from './Extension.types';

export interface ExtensionsApi {
  /**
   * Returns an extension by ID. Throws an ExtensionNotRegisteredError
   * if the extension is not registered.
   *
   * @param extensionId The ID of the extension to retrieve.
   */
  get(extensionId: string): Extension;

  /**
   * Returns an array of all enabled extensions.
   *
   * @returns An array containing all enabled extensions.
   */
  getEnabled(): Extension[];

  /**
   * Registers a new extension and dispatches a
   * `extensions:register` event.
   *
   * @param core A MindDrop core instance.
   * @param extension The extension to register.
   */
  register(core: Core, extension: Extension): void;

  /**
   * Removes an extension from the extensions store and
   * dispatches a `extensions:unregister` event.
   *
   * @param core A MindDrop core instance.
   * @param extensionId The ID of the extension to unregister.
   */
  unregister(core: Core, extensionId: string): void;

  /**
   * Returns the IDs of extensions enabled for a given topic.
   *
   * @param topicId The ID of the topic for which to retrieve the extensions.
   * @returns The IDs of the extensions.
   */
  getTopicExtensions(topicId: string): string[];

  /**
   * Enables an extension on topics and dispatches a
   * `extensions:enable-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param extensionId The ID of the extension to enable.
   * @param topicsIds The IDs of the topics for which to enable the extension.
   */
  enableOnTopics(core: Core, extensionId: string, topicsIds: string[]): void;

  /**
   * Disables an extension on topics and dispatches a
   * `extensions:disable-topics` event.
   *
   * @param core A MindDrop core instance.
   * @param extensionId The ID of the extension to disable.
   * @param topicIds The ID of the topics for which to disable the extension.
   */
  disableOnTopics(core: Core, extensionId: string, topicIds: string[]): void;

  /**
   * Clears the extensions store.
   *
   * @param core A MindDrop core extension.
   */
  clear(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'extensions:register' event listener
  addEventListener(
    core: Core,
    type: RegisterExtensionEvent,
    callback: RegisterExtensionEventCallback,
  ): void;

  // Add 'extensions:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterExtensionEvent,
    callback: UnregisterExtensionEventCallback,
  ): void;

  // Add 'extensions:enable-topics' event listener
  addEventListener(
    core: Core,
    type: EnableExtensionOnTopicsEvent,
    callback: EnableExtensionOnTopicsEventCallback,
  ): void;

  // Add 'extensions:disable-topics' event listener
  addEventListener(
    core: Core,
    type: DisableExtensionOnTopicsEvent,
    callback: DisableExtensionOnTopicsEventCallback,
  ): void;

  // Add 'extensions:clear' event listener
  addEventListener(
    core: Core,
    type: ClearExtensionsEvent,
    callback: ClearExtensionsEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'extensions:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterExtensionEvent,
    callback: RegisterExtensionEventCallback,
  ): void;

  // Remove 'extensions:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterExtensionEvent,
    callback: UnregisterExtensionEventCallback,
  ): void;

  // Remove 'extensions:enable-topics' event listener
  removeEventListener(
    core: Core,
    type: EnableExtensionOnTopicsEvent,
    callback: EnableExtensionOnTopicsEventCallback,
  ): void;

  // Remove 'extensions:disable-topics' event listener
  removeEventListener(
    core: Core,
    type: DisableExtensionOnTopicsEvent,
    callback: DisableExtensionOnTopicsEventCallback,
  ): void;

  // Remove 'extensions:clear' event listener
  removeEventListener(
    core: Core,
    type: ClearExtensionsEvent,
    callback: ClearExtensionsEventCallback,
  ): void;
}