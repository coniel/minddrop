import { EventListenerCallback, Core } from '@minddrop/core';
import {
  CreateDropEvent,
  CreateDropEventData,
  UpdateDropEvent,
  UpdateDropEventData,
  ArchiveDropEvent,
  ArchiveDropEventData,
  UnarchiveDropEvent,
  UnarchiveDropEventData,
  DeleteDropEvent,
  DeleteDropEventData,
  RestoreDropEvent,
  RestoreDropEventData,
} from './DropEventData.types';

/**
 * Add drop related `addEventListener` and `dispatch`
 * function overloads.
 */
export interface DropCore extends Core {
  // Add create-drop event listener
  addEventListener(
    source: string,
    type: CreateDropEvent,
    callback: EventListenerCallback<CreateDropEvent, CreateDropEventData>,
  ): void;

  // Add update-drop event listener
  addEventListener(
    source: string,
    type: UpdateDropEvent,
    callback: EventListenerCallback<UpdateDropEvent, UpdateDropEventData>,
  ): void;

  // Add archive-drop event listener
  addEventListener(
    source: string,
    type: ArchiveDropEvent,
    callback: EventListenerCallback<ArchiveDropEvent, ArchiveDropEventData>,
  ): void;

  // Add unarchive-drop event listener
  addEventListener(
    source: string,
    type: UnarchiveDropEvent,
    callback: EventListenerCallback<UnarchiveDropEvent, UnarchiveDropEventData>,
  ): void;

  // Add delete-drop event listener
  addEventListener(
    source: string,
    type: DeleteDropEvent,
    callback: EventListenerCallback<DeleteDropEvent, DeleteDropEventData>,
  ): void;

  // Add restore-drop event listener
  addEventListener(
    source: string,
    type: RestoreDropEvent,
    callback: EventListenerCallback<RestoreDropEvent, RestoreDropEventData>,
  ): void;

  // Dispatch create-drop event
  dispatch(
    source: string,
    type: CreateDropEvent,
    data: CreateDropEventData,
  ): void;

  // Dispatch update-drop event
  dispatch(
    source: string,
    type: UpdateDropEvent,
    data: UpdateDropEventData,
  ): void;

  // Dispatch archive-drop event
  dispatch(
    source: string,
    type: ArchiveDropEvent,
    data: ArchiveDropEventData,
  ): void;

  // Dispatch unarchive-drop event
  dispatch(
    source: string,
    type: UnarchiveDropEvent,
    data: UnarchiveDropEventData,
  ): void;

  // Dispatch delete-drop event
  dispatch(
    source: string,
    type: DeleteDropEvent,
    data: DeleteDropEventData,
  ): void;

  // Dispatch restore-drop event
  dispatch(
    source: string,
    type: RestoreDropEvent,
    data: RestoreDropEventData,
  ): void;
}
