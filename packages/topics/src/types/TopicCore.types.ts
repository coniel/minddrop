import { EventListenerCallback, Core } from '@minddrop/core';
import {
  CreateTopicEvent,
  CreateTopicEventData,
  UpdateTopicEvent,
  UpdateTopicEventData,
  ArchiveTopicEvent,
  ArchiveTopicEventData,
  UnarchiveTopicEvent,
  UnarchiveTopicEventData,
  DeleteTopicEvent,
  DeleteTopicEventData,
  RestoreTopicEvent,
  RestoreTopicEventData,
  AddTopicEvent,
  AddTopicEventData,
  MoveTopicEvent,
  MoveTopicEventData,
} from './TopicEventData.types';

/**
 * Add topic related `addEventListener` and `dispatch`
 * function overloads.
 */
export interface TopicCore extends Core {
  // Add create-topic event listener
  addEventListener(
    source: string,
    type: CreateTopicEvent,
    callback: EventListenerCallback<CreateTopicEvent, CreateTopicEventData>,
  ): void;

  // Add update-topic event listener
  addEventListener(
    source: string,
    type: UpdateTopicEvent,
    callback: EventListenerCallback<UpdateTopicEvent, UpdateTopicEventData>,
  ): void;

  // Add move-topic event listener
  addEventListener(
    source: string,
    type: MoveTopicEvent,
    callback: EventListenerCallback<MoveTopicEvent, MoveTopicEventData>,
  ): void;

  // Add add-topic event listener
  addEventListener(
    source: string,
    type: AddTopicEvent,
    callback: EventListenerCallback<AddTopicEvent, AddTopicEventData>,
  ): void;

  // Add archive-topic event listener
  addEventListener(
    source: string,
    type: ArchiveTopicEvent,
    callback: EventListenerCallback<ArchiveTopicEvent, ArchiveTopicEventData>,
  ): void;

  // Add unarchive-topic event listener
  addEventListener(
    source: string,
    type: UnarchiveTopicEvent,
    callback: EventListenerCallback<
      UnarchiveTopicEvent,
      UnarchiveTopicEventData
    >,
  ): void;

  // Add delete-topic event listener
  addEventListener(
    source: string,
    type: DeleteTopicEvent,
    callback: EventListenerCallback<DeleteTopicEvent, DeleteTopicEventData>,
  ): void;

  // Add restore-topic event listener
  addEventListener(
    source: string,
    type: RestoreTopicEvent,
    callback: EventListenerCallback<RestoreTopicEvent, RestoreTopicEventData>,
  ): void;

  // Dispatch create-topic event
  dispatch(
    source: string,
    type: CreateTopicEvent,
    data: CreateTopicEventData,
  ): void;

  // Dispatch update-topic event
  dispatch(
    source: string,
    type: UpdateTopicEvent,
    data: UpdateTopicEventData,
  ): void;

  // Dispatch move-topic event
  dispatch(
    source: string,
    type: MoveTopicEvent,
    data: MoveTopicEventData,
  ): void;

  // Dispatch add-topic event
  dispatch(source: string, type: AddTopicEvent, data: AddTopicEventData): void;

  // Dispatch archive-topic event
  dispatch(
    source: string,
    type: ArchiveTopicEvent,
    data: ArchiveTopicEventData,
  ): void;

  // Dispatch unarchive-topic event
  dispatch(
    source: string,
    type: UnarchiveTopicEvent,
    data: UnarchiveTopicEventData,
  ): void;

  // Dispatch delete-topic event
  dispatch(
    source: string,
    type: DeleteTopicEvent,
    data: DeleteTopicEventData,
  ): void;

  // Dispatch restore-topic event
  dispatch(
    source: string,
    type: RestoreTopicEvent,
    data: RestoreTopicEventData,
  ): void;
}
