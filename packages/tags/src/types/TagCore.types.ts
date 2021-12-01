import { EventListenerCallback, Core } from '@minddrop/core';
import {
  CreateTagEvent,
  CreateTagEventData,
  UpdateTagEvent,
  UpdateTagEventData,
  DeleteTagEvent,
  DeleteTagEventData,
} from './TagEventData.types';

/**
 * Add tag related `addEventListener` and `dispatch`
 * function overloads.
 */
export interface TagCore extends Core {
  // Add create-tag event listener
  addEventListener(
    source: string,
    type: CreateTagEvent,
    callback: EventListenerCallback<CreateTagEvent, CreateTagEventData>,
  ): void;

  // Add update-tag event listener
  addEventListener(
    source: string,
    type: UpdateTagEvent,
    callback: EventListenerCallback<UpdateTagEvent, UpdateTagEventData>,
  ): void;

  // Add delete-tag event listener
  addEventListener(
    source: string,
    type: DeleteTagEvent,
    callback: EventListenerCallback<DeleteTagEvent, DeleteTagEventData>,
  ): void;

  // Dispatch create-tag event
  dispatch(
    source: string,
    type: CreateTagEvent,
    data: CreateTagEventData,
  ): void;

  // Dispatch update-tag event
  dispatch(
    source: string,
    type: UpdateTagEvent,
    data: UpdateTagEventData,
  ): void;

  // Dispatch delete-tag event
  dispatch(
    source: string,
    type: DeleteTagEvent,
    data: DeleteTagEventData,
  ): void;
}
