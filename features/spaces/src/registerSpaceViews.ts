import { SpacesIcon } from '@minddrop/spaces';
import { Views } from '@minddrop/views';
import { SpaceView } from './SpaceView';
import { SpacesView } from './SpacesView';
import { SpaceViewName, SpacesViewName } from './events';

/**
 * Registers the spaces feature's views.
 */
export function registerSpaceViews(): void {
  // Register the space view, which is labelled by its space
  Views.register({
    type: SpaceViewName,
    component: SpaceView,
    breadcrumbLevel: 'branch',
  });

  // Register the spaces list view
  Views.register({
    type: SpacesViewName,
    component: SpacesView,
    title: 'spaces.labels.spaces',
    icon: SpacesIcon,
    breadcrumbLevel: 'root',
  });
}
