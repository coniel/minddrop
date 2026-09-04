import { Events } from '@minddrop/events';
import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigRegisteredEvent } from '../events';
import { DesignElement, DesignElementConfig } from '../types';

/**
 * Registers a design element type config.
 *
 * @param config - The design element type config to register.
 *
 * @dispatches 'designs-next:element-config:registered' event
 */
export function registerDesignElementConfig<TElement extends DesignElement>(
  config: DesignElementConfig<TElement>,
): void {
  // Erase the config's element type for storage and dispatch
  const erasedConfig = config as unknown as DesignElementConfig;

  // Add the config to the store
  DesignElementConfigsStore.set(erasedConfig);

  // Dispatch the design element config registered event
  Events.dispatch(DesignElementConfigRegisteredEvent, erasedConfig);
}
