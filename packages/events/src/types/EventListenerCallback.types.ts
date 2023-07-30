import { Event } from './Event.types';

export type EventListenerCallback<TData = any> = (
  event: Event<TData>,
) => void | Promise<void>;
