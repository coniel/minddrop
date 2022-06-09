import { Core } from '@minddrop/core';
import { ResourceApi } from '@minddrop/resources';
import {
  ViewInstance,
  ViewInstanceMap,
  ViewInstanceTypeData,
} from './ViewInstance.types';
import {
  CreateViewInstanceEvent,
  CreateViewInstanceEventCallback,
  DeleteViewInstanceEvent,
  DeleteViewInstanceEventCallback,
  LoadViewInstancesEvent,
  LoadViewInstancesEventCallback,
  UpdateViewInstanceEvent,
  UpdateViewInstanceEventCallback,
  PermanentlyDeleteViewInstanceEvent,
  PermanentlyDeleteViewInstanceEventCallback,
  RestoreViewInstanceEvent,
  RestoreViewInstanceEventCallback,
} from './ViewEvents.types';

export interface ViewInstancesApi {
  /**
   * Returns a view instance by ID.
   *
   * @param viewInstanceId - The ID of the view instance to retrieve.
   * @returns The requested view instance.
   *
   * @throws DocumentNotFoundError
   * Thrown if the requested view instance does not exist.
   */
  get<TData extends ViewInstanceTypeData = {}>(
    viewInstanceId: string,
  ): ViewInstance<TData>;

  /**
   * Returns a `{ [id]: ViewInstance }` map of view intances
   * by ID.
   *
   * @param viewInstanceIds - The IDs of the view instances to retrieve.
   * @returns The requested view instances.
   *
   * @throws DocumentNotFoundError
   * Thrown if any of the requested view instance does not exist.
   */
  get<TData extends ViewInstanceTypeData = {}>(
    viewInstanceIds: string[],
  ): ViewInstanceMap<TData>;

  /**
   * Returns a `{ [id]: ViewInstance }` map of all
   * view intances.
   *
   * @returns All view instances.
   */
  getAll<TData extends ViewInstanceTypeData = {}>(): ViewInstanceMap<TData>;

  /**
   * Creates a new view instance.
   * Dispatches a `views:view-instance:create` event.
   *
   * @param core - A MindDrop core instance.
   * @param viewId - The ID of the instance view for which to create an instance.
   * @param data - The view instance data.
   *
   * @throws ResourceTypeNotRegistered
   * Thrown if the view is not registered.
   *
   * @throws ResourceValidationError
   * Thrown if the view instance data is invalid.
   */
  create<
    TCreateData extends ViewInstanceTypeData = {},
    TTypeData extends ViewInstanceTypeData = {},
  >(
    core: Core,
    viewId: string,
    data: TCreateData,
  ): ViewInstance<TTypeData>;

  /**
   * Updates a view instance.
   * Dispatches a `views:view-instance:update` event.
   *
   * @param core - A MindDrop core instance.
   * @param viewInstanceId - The ID of the view instance to update.
   * @param data - The update data.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the view instance does not exist.
   *
   * @throws ResourceValidationError
   * Thrown if the update data is invalid.
   */
  update<
    TUpdateData extends ViewInstanceTypeData = {},
    TTypeData extends ViewInstanceTypeData = {},
  >(
    core: Core,
    viewInstanceId: string,
    data: TUpdateData,
  ): ViewInstance<TTypeData>;

  /**
   * Soft deletes a view instance.
   * Dispatches a `views:view-instance:delete` event.
   *
   * Soft-deleted view instance can be restored using the
   * `restore` method.
   *
   * @param core - A MindDrop core instance.
   * @param viewInstanceId - The ID of the view instance to delete.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the view instance does not exist.
   */
  delete<TTypeData extends ViewInstanceTypeData = {}>(
    core: Core,
    viewInstanceId: string,
  ): ViewInstance<TTypeData>;

  /**
   * Restores a soft-deleted view instance.
   * Dispatches a `views:view-instance:restore` event.
   *
   * @param core - A MindDrop core instance.
   * @param viewInstanceId - The ID of the view instance to restore.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the view instance does not exist.
   */
  restore<TTypeData extends ViewInstanceTypeData = {}>(
    core: Core,
    viewInstanceId: string,
  ): ViewInstance<TTypeData>;

  /**
   * Permanently deletes a view instance.
   * Dispatches a `views:view-instance:delete-permanently` event.
   *
   * Permanently deleted view instances cannot be restored.
   *
   * @param core - A MindDrop core instance.
   * @param viewInstanceId - The ID of the view instance to delete permanently.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the view instance does not exist.
   */
  deletePermanently<TTypeData extends ViewInstanceTypeData = {}>(
    core: Core,
    viewInstanceId: string,
  ): ViewInstance<TTypeData>;

  /**
   * The view instance resource documents store.
   */
  store: ResourceApi['store'];

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'views:view-instance:create' event listener
  addEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Add 'views:view-instance:update' event listener
  addEventListener(
    core: Core,
    type: UpdateViewInstanceEvent,
    callback: UpdateViewInstanceEventCallback,
  ): void;

  // Add 'views:view-instance:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Add 'views:view-instance:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreViewInstanceEvent,
    callback: RestoreViewInstanceEventCallback,
  ): void;

  // Add 'views:view-instance:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteViewInstanceEvent,
    callback: PermanentlyDeleteViewInstanceEventCallback,
  ): void;

  // Add 'views:view-instance:load' event listener
  addEventListener(
    core: Core,
    type: LoadViewInstancesEvent,
    callback: LoadViewInstancesEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'views:view-instance:create' event listener
  removeEventListener(
    core: Core,
    type: CreateViewInstanceEvent,
    callback: CreateViewInstanceEventCallback,
  ): void;

  // Remove 'views:view-instance:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateViewInstanceEvent,
    callback: UpdateViewInstanceEventCallback,
  ): void;

  // Remove 'views:view-instance:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteViewInstanceEvent,
    callback: DeleteViewInstanceEventCallback,
  ): void;

  // Remove 'views:view-instance:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreViewInstanceEvent,
    callback: RestoreViewInstanceEventCallback,
  ): void;

  // Remove 'views:view-instance:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteViewInstanceEvent,
    callback: PermanentlyDeleteViewInstanceEventCallback,
  ): void;

  // Remove 'views:view-instance:load' event listener
  removeEventListener(
    core: Core,
    type: LoadViewInstancesEvent,
    callback: LoadViewInstancesEventCallback,
  ): void;
}
