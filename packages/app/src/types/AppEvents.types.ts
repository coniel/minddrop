import { EventListenerCallback } from '@minddrop/core';
import { View } from './View.types';

export type OpenViewEvent = 'app:open-view';

export type OpenViewEventData = View;

export type OpenViewEventCallback = EventListenerCallback<
  OpenViewEvent,
  OpenViewEventData
>;
