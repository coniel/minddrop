import { Core, DataInsert } from '@minddrop/core';
import {
  TypedResourceApi,
  TypedResourceDocumentFilters,
} from '@minddrop/resources';
import {
  BaseCreateDropData,
  Drop,
  DropMap,
  DropTypeData,
  BaseUpdateDropData,
  DropBaseData,
} from './Drop.types';
import {
  DropTypeConfig,
  RegisteredDropTypeConfig,
  DropTypeConfigOptions,
} from './DropTypeConfig.types';
import {
  AddDropEvent,
  AddDropEventCallback,
  CreateDropEvent,
  CreateDropEventCallback,
  DeleteDropEvent,
  DeleteDropEventCallback,
  LoadDropsEvent,
  LoadDropsEventCallback,
  PermanentlyDeleteDropEvent,
  PermanentlyDeleteDropEventCallback,
  RegisterDropTypeEvent,
  RegisterDropTypeEventCallback,
  RemoveDropEvent,
  RemoveDropEventCallback,
  RestoreDropEvent,
  RestoreDropEventCallback,
  SetDropEventCallback,
  SetDropEventData,
  UnregisterDropTypeEvent,
  UnregisterDropTypeEventCallback,
  UpdateDropEvent,
  UpdateDropEventCallback,
} from './DropEvents.types';

export interface DropsApi
  extends TypedResourceApi<
    DropBaseData,
    BaseCreateDropData,
    BaseUpdateDropData,
    DropTypeConfigOptions
  > {
  /**
   * Retrieves one or more drops by ID.
   *
   * If provided a single ID string, returns the drop.
   *
   * If provided an array of IDs, returns a `{ [id]: Drop }` map of the corresponding drops.
   * Drops can be filtered by passing in DropFilters. Filtering is not supported when getting a single drop.
   *
   * @param ids - An array of drop IDs to retrieve.
   * @param filters - Filters to filter to the drops by, only supported when getting multiple drops.
   * @returns The requested drop(s).
   */
  get<TDropData extends DropTypeData = {}>(dropId: string): Drop<TDropData>;
  get<TDropData extends DropTypeData = {}>(
    dropIds: string[],
    filters?: TypedResourceDocumentFilters,
  ): DropMap<Drop<TDropData>>;

  /**
   * Retrieves all drops from the drops store as a `{ [id]: Drop }` map.
   * Drops can be filtered by passing in DropFilters.
   *
   * @param filters - Filters to filter to the drops by.
   * @returns A `{ [id]: Drop }` map.
   */
  getAll<TDropData extends DropTypeData = {}>(
    filters?: TypedResourceDocumentFilters,
  ): DropMap<Drop<TDropData>>;

  /**
   * Returns the `DropTypeConfig` for a given drop type.
   *
   * @param type - The drop type for which to retrieve the config.
   */
  getTypeConfig<TDropData extends DropTypeData = {}>(
    type: string,
  ): RegisteredDropTypeConfig<TDropData>;

  /**
   * Returns all registered `DropTypeConfig`s.
   *
   * @returns An array of drop type configs.
   */
  getAllTypeConfigs<
    TDropData extends DropTypeData = {},
  >(): RegisteredDropTypeConfig<TDropData>[];

  /**
   * Filters drops by type, active, and deleted states.
   * If no filters are set, returns active drops.
   * If deleted filters is `true`, active drops are not
   * included unless specifically set to `true`.
   *
   * @param drops - The drops to filter.
   * @param filters The filters by which to filter the drops.
   * @returns The filtered drops.
   */
  filter<TTypeData extends DropTypeData = {}>(
    drops: DropMap,
    filters: TypedResourceDocumentFilters,
  ): DropMap<Drop<TTypeData>>;

  /**
   * Registers a new drop type and dispatches a `drops:drop:register`
   * event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The configartion of the drop type to register.
   */
  register(core: Core, config: DropTypeConfig): void;

  /**
   * Unregisters a drop type and dispatches a `drops:drop:unregister` event.
   *
   * @param core - A MindDrop core instance.
   * @param type - The type of drop to unregister.
   */
  unregister(core: Core, config: DropTypeConfig): void;

  /**
   * Creates a new drop and dispatches a `drops:drop:create` event.
   *
   * @param core - A MindDrop core instance.
   * @param type - The type of drop to create.
   * @param data - The default drop property values.
   * @returns The newly created drop.
   */
  create<TTypeCreateData = {}, TTypeData extends DropTypeData = {}>(
    core: Core,
    type: string,
    data?: BaseCreateDropData & TTypeCreateData,
  ): Drop<TTypeData>;

  /**
   * Creates drops of the appropriate type given a `DataInsert` object
   * and an array of `DropTypeConfig` objects. Returns a promise resolving
   * to a `{ [id]: Drop }` map of the created drops. Dispatches a
   * `drops:create` event for each created drop.
   *
   * @param core - A MindDrop core instance.
   * @param data - The data from which to create the drops.
   * @param configs - The drop configs from which to create the drops.
   */
  createFromDataInsert(
    core: Core,
    dataInsert: DataInsert,
    configs: DropTypeConfig[],
  ): DropMap;

  /**
   * Duplicates the given drops by creating new drops
   * with the same data.
   *
   * @param core - A MindDrop core instance.
   * @param dropIds - The IDs of the drops to duplicate.
   * @returns The new drops.
   */
  duplicate<TTypeData extends DropTypeData>(
    core: Core,
    dropIds: string[],
  ): DropMap<Drop<TTypeData>>;

  /**
   * Updates a drop and dispatches a `drops:drop:update` event.
   *
   * @param core - A MindDrop core instance.
   * @param id - The ID of the drop to update.
   * @param data - The changes to apply to the drop.
   * @returns The updated drop.
   */
  update<TTypeUpdateData = {}, TTypeData extends DropTypeData = {}>(
    core: Core,
    id: string,
    data: BaseUpdateDropData & TTypeUpdateData,
  ): Drop<TTypeData>;

  /**
   * Soft deletes a drop and dispatches a `drops:drop:delete` event.
   *
   * Soft deleted drops can be restored using the `restore`
   * method.
   *
   * @param core - A MindDrop core instance.
   * @param dropId - The ID of the drop to delete.
   * @returns The deleted drop.
   */
  delete<TDropData extends DropTypeData = {}>(
    core: Core,
    dropId: string,
  ): Drop<TDropData>;

  /**
   * Restores a deleted drop and dispatches a
   * `drops:restore` event and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to restore.
   * @returns The restored drop.
   */
  restore<TDropData extends DropTypeData = {}>(
    core: Core,
    dropId: string,
  ): Drop<TDropData>;

  /**
   * Permanently deletes a drop and dispatches a
   * `drops:delete-permanently` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to delete permanently.
   * @returns The deleted drop.
   */
  deletePermanently<TDropData extends DropTypeData = {}>(
    core: Core,
    dropId: string,
  ): Drop<TDropData>;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'drops:drop:register' event listener
  addEventListener(
    core: Core,
    type: RegisterDropTypeEvent,
    callback: RegisterDropTypeEventCallback,
  ): void;

  // Add 'drops:drop:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterDropTypeEvent,
    callback: UnregisterDropTypeEventCallback,
  ): void;

  // Add 'drops:drop:create' event listener
  addEventListener(
    core: Core,
    type: CreateDropEvent,
    callback: CreateDropEventCallback,
  ): void;

  // Add 'drops:drop:update' event listener
  addEventListener(
    core: Core,
    type: UpdateDropEvent,
    callback: UpdateDropEventCallback,
  ): void;

  // Add 'drops:drop:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteDropEvent,
    callback: DeleteDropEventCallback,
  ): void;

  // Add 'drops:drop:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreDropEvent,
    callback: RestoreDropEventCallback,
  ): void;

  // Add 'drops:drop:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteDropEvent,
    callback: PermanentlyDeleteDropEventCallback,
  ): void;

  // Add 'drops:drop:load' event listener
  addEventListener(
    core: Core,
    type: LoadDropsEvent,
    callback: LoadDropsEventCallback,
  ): void;

  // Add 'drops:drop:add' event listener
  addEventListener(
    core: Core,
    type: AddDropEvent,
    callback: AddDropEventCallback,
  ): void;

  // Add 'drops:drop:set' event listener
  addEventListener(
    core: Core,
    type: SetDropEventData,
    callback: SetDropEventCallback,
  ): void;

  // Add 'drops:drop:remove' event listener
  addEventListener(
    core: Core,
    type: RemoveDropEvent,
    callback: RemoveDropEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'drops:drop:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterDropTypeEvent,
    callback: RegisterDropTypeEventCallback,
  ): void;

  // Remove 'drops:drop:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterDropTypeEvent,
    callback: UnregisterDropTypeEventCallback,
  ): void;

  // Remove 'drops:drop:create' event listener
  removeEventListener(
    core: Core,
    type: CreateDropEvent,
    callback: CreateDropEventCallback,
  ): void;

  // Remove 'drops:drop:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateDropEvent,
    callback: UpdateDropEventCallback,
  ): void;

  // Remove 'drops:drop:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteDropEvent,
    callback: DeleteDropEventCallback,
  ): void;

  // Remove 'drops:drop:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreDropEvent,
    callback: RestoreDropEventCallback,
  ): void;

  // Remove 'drops:drop:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteDropEvent,
    callback: PermanentlyDeleteDropEventCallback,
  ): void;

  // Remove 'drops:drop:load' event listener
  removeEventListener(
    core: Core,
    type: LoadDropsEvent,
    callback: LoadDropsEventCallback,
  ): void;

  // Remove 'drops:drop:add' event listener
  removeEventListener(
    core: Core,
    type: AddDropEvent,
    callback: AddDropEventCallback,
  ): void;

  // Remove 'drops:drop:set' event listener
  removeEventListener(
    core: Core,
    type: SetDropEventData,
    callback: SetDropEventCallback,
  ): void;

  // Remove 'drops:drop:remove' event listener
  removeEventListener(
    core: Core,
    type: RemoveDropEvent,
    callback: RemoveDropEventCallback,
  ): void;
}
