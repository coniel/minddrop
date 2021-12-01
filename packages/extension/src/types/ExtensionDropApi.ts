import { EventListenerCallback } from '@minddrop/core';
import {
  ArchiveDropEvent,
  ArchiveDropEventData,
  CreateDropData,
  CreateDropEvent,
  CreateDropEventData,
  DeleteDropEvent,
  DeleteDropEventData,
  RestoreDropEvent,
  RestoreDropEventData,
  Drop,
  UnarchiveDropEvent,
  UnarchiveDropEventData,
  UpdateDropData,
  UpdateDropEvent,
  UpdateDropEventData,
} from '@minddrop/drops';
import {
  AddDropEvent,
  AddDropEventData,
  MoveDropEvent,
  MoveDropEventData,
} from '@minddrop/app';

export interface ExtensionDropApi {
  /**
   * Creates a new drop, returing the drop.
   *
   * @param data The drop data.
   * @param parent The ID of the parent drop. If ommited the drop will be created at the root level.
   *
   * @returns The newly created drop.
   */
  createDrop(data?: CreateDropData, parent?: string): Drop;

  /**
   * Updates a drop, returning the updated drop.
   *
   * @param id The ID of the drop being updated.
   * @param data Updates to be applied to the drop.
   *
   * @returns The updated drop.
   */
  updateDrop(id: string, data: UpdateDropData): Drop;

  /**
   * Adds an existing drop into another drop, or to the root level. The drop is *not* removed from its current parent.
   *
   * @param id The ID of the drop to add.
   * @param to The ID of the parent drop into which to add the drop. `null` if adding to the root level.
   */
  addDrop(id: string, to: string | null): void;

  /**
   * Moves a drop into another drop or the root level. The drop *is* removed from its current parent.
   *
   * @param id The ID of the moved drop.
   * @param from The ID of the parent drop from which the drop is being moved, `null` if moving from root level.
   * @param to The ID of the parent drop into which the drop is being moved, `null` if moving to root level.
   */
  moveDrop(id: string, from: string | null, to: string | null): void;

  /**
   * Archives a drop.
   *
   * @param id The ID of the drop to archive.
   */
  archiveDrop(id: string): void;

  /**
   * Deletes a drop. Deleted drops can still be
   * recovered from the trash.
   *
   * @param id The ID of the drop to delete.
   */
  deleteDrop(id: string): void;

  // Event listeners
  // Create drop
  addEventListener(
    type: CreateDropEvent,
    callback: EventListenerCallback<CreateDropEvent, CreateDropEventData>,
  ): void;

  // Update drop
  addEventListener(
    type: UpdateDropEvent,
    callback: EventListenerCallback<UpdateDropEvent, UpdateDropEventData>,
  ): void;

  // Move drop into another drop
  addEventListener(
    type: MoveDropEvent,
    callback: EventListenerCallback<MoveDropEvent, MoveDropEventData>,
  ): void;

  // Add drop to another drop
  addEventListener(
    type: AddDropEvent,
    callback: EventListenerCallback<AddDropEvent, AddDropEventData>,
  ): void;

  // Archive drop
  addEventListener(
    type: ArchiveDropEvent,
    callback: EventListenerCallback<ArchiveDropEvent, ArchiveDropEventData>,
  ): void;

  // Unarchive drop
  addEventListener(
    type: UnarchiveDropEvent,
    callback: EventListenerCallback<UnarchiveDropEvent, UnarchiveDropEventData>,
  ): void;

  // Delete drop
  addEventListener(
    type: DeleteDropEvent,
    callback: EventListenerCallback<DeleteDropEvent, DeleteDropEventData>,
  ): void;

  // Restore drop
  addEventListener(
    type: RestoreDropEvent,
    callback: EventListenerCallback<RestoreDropEvent, RestoreDropEventData>,
  ): void;
}
