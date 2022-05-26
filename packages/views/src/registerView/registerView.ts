import { Core } from '@minddrop/core';
import { ViewConfig } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Registers a new view and dispatches a `views:view:register`
 * event.
 *
 * @param core - A MindDrop core instance.
 * @param view - The config of the view to register.
 */
export function registerView(core: Core, config: ViewConfig): void {
  // Add extension ID to config
  const view = { ...config, extension: core.extensionId };

  // Add view to store
  useViewsStore.getState().setView(view);

  // Dispatch 'views:view:register' event
  core.dispatch('views:view:register', view);
}
