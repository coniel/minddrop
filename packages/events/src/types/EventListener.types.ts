import { EventListenerCallback } from './EventListenerCallback.types';

export interface EventListener<TData = unknown> {
  id: string;
  callback: EventListenerCallback<TData>;
  once?: boolean;
}
