import { Views } from '@minddrop/views';
import { DesignStudio } from './DesignStudio';
import { DesignStudioViewName } from './events';

/**
 * Registers the design feature's main content views so they can be
 * opened by id via `OpenViewEvent`.
 */
export function registerDesignViews(): void {
  Views.register({
    type: DesignStudioViewName,
    component: DesignStudio,
  });
}
