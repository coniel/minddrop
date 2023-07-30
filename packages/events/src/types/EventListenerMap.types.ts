import { EventListener } from './EventListener.types';

export type EventListenerMap = Record<string, { listeners: EventListener[] }>;
