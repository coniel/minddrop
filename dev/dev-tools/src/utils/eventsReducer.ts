import { EventEntry } from '../types';

const MAX_EVENTS = 2000;

export type EventsAction =
  | { type: 'add'; entry: EventEntry }
  | { type: 'clear' };

export function eventsReducer(
  state: EventEntry[],
  action: EventsAction,
): EventEntry[] {
  switch (action.type) {
    case 'add':
      return [...state, action.entry].slice(-MAX_EVENTS);
    case 'clear':
      return [];
  }
}
