import { Event } from './Event.types';

export type EventListenerCallback<TData = unknown> = (
  event: Event<TData>,
) => void | Promise<void>;
