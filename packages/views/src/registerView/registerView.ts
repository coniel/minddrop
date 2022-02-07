import { Core } from '@minddrop/core';
import { View } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Registers a new view and dispatches a `views:register`
 * event.
 *
 * @param core A MindDrop core instance.
 * @param config The config of the view to register.
 */
export function registerView(core: Core, config: View): void {
  useViewsStore.getState().setView(config);

  core.dispatch('views:register', config);
}
