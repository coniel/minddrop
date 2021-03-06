import { Core } from '@minddrop/core';
import { ResourceApi, ConfigsStore } from '@minddrop/resources';
import {
  CreateExtensionDocumentEvent,
  CreateExtensionDocumentEventCallback,
  DeleteExtensionDocumentEvent,
  DeleteExtensionDocumentEventCallback,
  DisableExtensionOnTopicsEvent,
  DisableExtensionOnTopicsEventCallback,
  EnableExtensionOnTopicsEvent,
  EnableExtensionOnTopicsEventCallback,
  RegisterExtensionEvent,
  RegisterExtensionEventCallback,
  UnregisterExtensionEvent,
  UnregisterExtensionEventCallback,
  UpdateExtensionDocumentEvent,
  UpdateExtensionDocumentEventCallback,
} from './ExtensionEvents.types';
import { Extension } from './Extension.types';
import { ExtensionConfig } from './ExtensionConfig.types';

export interface ExtensionsApi {
  /**
   * Returns an extension by ID. Throws a `ExtensionNotRegisteredError`
   * if the extension is not registered.
   *
   * @param extensionId - The ID of the extension to retrieve.
   * @returns The requested extension.
   *
   * @throws ExtensionNotRegisteredError
   * Thrown if the extension is not registered.
   */
  get(extensionId: string): Extension;

  /**
   * Returns an array of all registered extensions,
   * including disabled ones.
   *
   * @returns An array containing all registered extensions.
   */
  getAll(): Extension[];

  /**
   * Returns an array of all enabled extensions.
   *
   * @returns An array containing all enabled extensions.
   */
  getEnabled(): Extension[];

  /**
   * Registers a new extension.
   * Dispatches a `extensions:extension:register` event.
   *
   * If the extension was not previously registered, creates
   * an associated extension document for it.
   *
   * Returns the registered extension.
   *
   * @param core - A MindDrop core instance.
   * @param extensionConfig - The config of the extension to register.
   * @returns The registered extension.
   */
  register(core: Core, extensionConfig: ExtensionConfig): Extension;

  /**
   * Unregisters an extension.
   * Dispatches a `extensions:extension:unregister` event.
   *
   * @param core - A MindDrop core instance.
   * @param extensionId - The ID of the extension to unregister.
   */
  unregister(core: Core, extensionId: string): void;

  /**
   * Returns the extensions enabled for a given topic.
   *
   * @param topicId - The ID of the topic for which to retrieve the extensions.
   * @returns An array of extensions.
   */
  getTopicExtensions(topicId: string): Extension[];

  /**
   * Enables an extension on topics.
   * Dispatches a `extensions:extension:enable-topics` event.
   *
   * @param core - A MindDrop core instance.
   * @param extensionId - The ID of the extension to enable.
   * @param topicsIds - The IDs of the topics for which to enable the extension.
   */
  enableOnTopics(core: Core, extensionId: string, topicsIds: string[]): void;

  /**
   * Disables an extension on topics.
   * Dispatches a `extensions:extension:disable-topics` event.
   *
   * @param core - A MindDrop core instance.
   * @param extensionId - The ID of the extension to disable.
   * @param topicIds - The ID of the topics for which to disable the extension.
   */
  disableOnTopics(core: Core, extensionId: string, topicIds: string[]): void;

  /**
   * Initializes the given extensions and runs
   * the enabled ones.
   *
   * @param core - A MindDrop core instance.
   * @param extensionConfigs - The extension configs to initialize.
   */
  initialize(core: Core, extensionConfigs: ExtensionConfig[]): void;

  store: ResourceApi['store'];

  configsStore: ConfigsStore<ExtensionConfig>;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'extensions:register' event listener
  addEventListener(
    core: Core,
    type: RegisterExtensionEvent,
    callback: RegisterExtensionEventCallback,
  ): void;

  // Add 'extensions:extension:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterExtensionEvent,
    callback: UnregisterExtensionEventCallback,
  ): void;

  // Add 'extensions:extension:enable-topics' event listener
  addEventListener(
    core: Core,
    type: EnableExtensionOnTopicsEvent,
    callback: EnableExtensionOnTopicsEventCallback,
  ): void;

  // Add 'extensions:extension:disable-topics' event listener
  addEventListener(
    core: Core,
    type: DisableExtensionOnTopicsEvent,
    callback: DisableExtensionOnTopicsEventCallback,
  ): void;

  // Add 'extensions:create-document' event listener
  addEventListener(
    core: Core,
    type: CreateExtensionDocumentEvent,
    callback: CreateExtensionDocumentEventCallback,
  ): void;

  // Add 'extensions:extension:update-document' event listener
  addEventListener(
    core: Core,
    type: UpdateExtensionDocumentEvent,
    callback: UpdateExtensionDocumentEventCallback,
  ): void;

  // Add 'extensions:delete-document' event listener
  addEventListener(
    core: Core,
    type: DeleteExtensionDocumentEvent,
    callback: DeleteExtensionDocumentEventCallback,
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

  // Remove 'extensions:extension:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterExtensionEvent,
    callback: UnregisterExtensionEventCallback,
  ): void;

  // Remove 'extensions:extension:enable-topics' event listener
  removeEventListener(
    core: Core,
    type: EnableExtensionOnTopicsEvent,
    callback: EnableExtensionOnTopicsEventCallback,
  ): void;

  // Remove 'extensions:extension:disable-topics' event listener
  removeEventListener(
    core: Core,
    type: DisableExtensionOnTopicsEvent,
    callback: DisableExtensionOnTopicsEventCallback,
  ): void;

  // Remove 'extensions:document:create' event listener
  removeEventListener(
    core: Core,
    type: CreateExtensionDocumentEvent,
    callback: CreateExtensionDocumentEventCallback,
  ): void;

  // Remove 'extensions:document:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateExtensionDocumentEvent,
    callback: UpdateExtensionDocumentEventCallback,
  ): void;

  // Remove 'extensions:document:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteExtensionDocumentEvent,
    callback: DeleteExtensionDocumentEventCallback,
  ): void;
}
