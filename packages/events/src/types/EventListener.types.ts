import { EventListenerCallback } from './EventListenerCallback.types';

export interface EventListener {
  id: string;
  callback: EventListenerCallback;
  once?: boolean;
}
