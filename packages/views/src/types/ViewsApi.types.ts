import { Core } from '@minddrop/core';
import { View } from './View.types';
import { ViewConfig } from './ViewConfig.types';
import {
  CreateViewInstanceData,
  UpdateViewInstanceData,
  ViewInstance,
  ViewInstanceMap,
} from './ViewInstance.types';
import {
  ClearViewsEvent,
  ClearViewsEventCallback,
  CreateViewInstanceEvent,
  CreateViewInstanceEventCallback,
  DeleteViewInstanceEvent,
  DeleteViewInstanceEventCallback,
  LoadViewInstancesEvent,
  LoadViewInstancesEventCallback,
  RegisterViewEvent,
  RegisterViewEventCallback,
  UnregisterViewEvent,
  UnregisterViewEventCallback,
  UpdateViewInstanceEvent,
  UpdateViewInstanceEventCallback,
} from './ViewEvents.types';

export interface ViewsApi {
  /**
   * Gets a view's config by ID.
   *
   * @param id The ID of the view to retrieve.
   * @returns The view's config.
   */
  get(id: string): View;

  /**
   * Retrieves a view instance by ID. Throws a `ViewInstanceNotFoundError`
   * if the view instance does not exist.
   *
   * @param viewInstanceId The ID of the view instance to retrieve.
   * @returns The view instance.
   */
  getInstance<T extends ViewInstance = ViewInstance>(viewInstanceId: string): T;

  /**
   * Returns a { [id]: ViewInstance | null } map of view intances
   * by ID (null if the view instance does not exist)
   *
   * @param viewInstanceIds The IDs of the view instances to retrieve.
   * @returns A { [id]: ViewInstance | null } map (null if the view instance does not exist).
   */
  getInstances<T extends ViewInstance = ViewInstance>(
    viewInstanceIds: string[],
  ): ViewInstanceMap<T>;

  /**
   * Registers a new view and dispatches a `views:register`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param config The config of the view to register.
   */
  register(core: Core, view: ViewConfig): void;

  /**
   * Unregister's a view from and dispatches a
   * `views:unregister` event.
   *
   * @param core A MindDrop core instance.
   * @param viewId The ID of the view to unregister.
   */
  unregister(core: Core, viewId: string): void;

  /**
   * Creates a new view instance and dispatches a
   * `views:create-instance` event.
   *
   * @param core A MindDrop core instance.
   * @param data The view instance data.
   */
  createInstance<
    D extends CreateViewInstanceData = CreateViewInstanceData,
    I extends ViewInstance = ViewInstance,
  >(
    core: Core,
    data: D,
  ): I;

  /**
   * Updates a view instance and dispatches a `views:update-instance`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param viewInstanceId The ID of the view instance to update.
   * @param data The update data.
   */
  updateInstance<
    D extends UpdateViewInstanceData,
    I extends ViewInstance = ViewInstance,
  >(
    core: Core,
    viewInstanceId: string,
    data: D,
  ): I;

  /**
   * Deletes a view instance and dispatches a `views:delete-instance`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param viewInstanceId The ID of the view instance to delete.
   */
  deleteInstance<T extends ViewInstance = ViewInstance>(
    core: Core,
    viewInstanceId: string,
  ): T;

  /**
   * Loads view instances into the store and dispatches a
   * `view:load-instances` event.
   *
   * @param core A MindDrop core instance.
   * @param viewInstances The view instance to load into the store.
   */
  loadInstances(core: Core, viewInstances: ViewInstance[]): void;

  /**
   * Clears all registered views and view instances from
   * the store and dispatches a `views:clear` event.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'views:register' event listener
  addEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Add 'views:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;

  // Add 'views:create-instance' event listener
  addEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Add 'views:update-instance' event listener
  addEventListener(
    core: Core,
    type: UpdateViewInstanceEvent,
    callback: UpdateViewInstanceEventCallback,
  ): void;

  // Add 'views:delete-instance' event listener
  addEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Add 'views:load-instances' event listener
  addEventListener(
    core: Core,
    type: LoadViewInstancesEvent,
    callback: LoadViewInstancesEventCallback,
  ): void;

  // Add 'views:clear' event listener
  addEventListener(
    core: Core,
    type: ClearViewsEvent,
    callback: ClearViewsEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'views:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Remove 'views:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;

  // Remove 'views:create-instance' event listener
  removeEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Remove 'views:update-instance' event listener
  removeEventListener(
    core: Core,
    type: UpdateViewInstanceEvent,
    callback: UpdateViewInstanceEventCallback,
  ): void;

  // Remove 'views:delete-instance' event listener
  removeEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Remove 'views:load-instances' event listener
  removeEventListener(
    core: Core,
    type: LoadViewInstancesEvent,
    callback: LoadViewInstancesEventCallback,
  ): void;

  // Remove 'views:clear' event listener
  removeEventListener(
    core: Core,
    type: ClearViewsEvent,
    callback: ClearViewsEventCallback,
  ): void;
}
