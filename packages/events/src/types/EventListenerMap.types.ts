import { EventListener } from './EventListener.types';

export type EventListenerMap<TData = unknown> = Record<
  string,
  { listeners: EventListener<TData>[] }
>;
