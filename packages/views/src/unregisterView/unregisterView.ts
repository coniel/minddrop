import { Core } from '@minddrop/core';
import { ViewNotRegisteredError } from '../errors';
import { ViewConfigsStore } from '../ViewConfigsStore';
import { ViewInstancesResource } from '../ViewInstancesResource';

/**
 * Unregister's a view.
 * Dispatches a `views:view:unregister` event.
 *
 * @param core - A MindDrop core instance.
 * @param viewId - The ID of the view to unregister.
 *
 * @throws ViewNotRegisteredError
 * Thrown if the view is not registered.
 */
export function unregisterView(core: Core, viewId: string): void {
  // Get the view config
  const config = ViewConfigsStore.get(viewId);

  if (!config) {
    // Throw a 'ViewNotRegisteredError' if the view is not registered
    throw new ViewNotRegisteredError(viewId);
  }

  // Unregister the view from the ViewConfigsStore
  ViewConfigsStore.unregister(config);

  if (config.type === 'instance') {
    // Unregister the view instance type
    ViewInstancesResource.unregister(core, { ...config, type: config.id });
  }

  // Dispatch a 'views:view:unregister' event
  core.dispatch('views:view:unregister', config);
}
