import { Views } from '@minddrop/views';
import { SpaceView } from './SpaceView';
import { SpaceViewName } from './events';

/**
 * Registers the spaces feature's views.
 */
export function registerSpaceViews(): void {
  // Register the space view
  Views.register({ type: SpaceViewName, component: SpaceView });
}
