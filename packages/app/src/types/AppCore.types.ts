import { ComponentType } from 'react';
import { Core } from '@minddrop/core';
import { ExtendUi } from './ExtenUi.types';

export interface App extends ExtendUi {
  /**
   * A component which will render UI extensions
   * for a given location.
   */
  Slot: ComponentType<{ location: string }>;
}

export type AppCore = Core & App;
