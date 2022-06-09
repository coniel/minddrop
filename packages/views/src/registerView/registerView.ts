import { Core } from '@minddrop/core';
import { ViewConfig } from '../types';
import { ViewConfigsStore } from '../ViewConfigsStore';
import { ViewInstancesResource } from '../ViewInstancesResource';

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

  // Register the the view with the ViewConfigsStore
  ViewConfigsStore.register(view);

  if (config.type === 'instance') {
    // Register the view instance type, replacing the
    // generic 'instance' type with the view ID.
    ViewInstancesResource.register(core, { ...config, type: config.id });
  }

  // Dispatch 'views:view:register' event
  core.dispatch('views:view:register', view);
}
