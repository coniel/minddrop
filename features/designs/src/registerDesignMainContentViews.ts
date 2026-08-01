import { MainContentViews } from '@minddrop/views';
import { DesignStudio } from './DesignStudio';
import { DesignStudioViewName } from './events';

/**
 * Registers the design feature's main content views so they can be
 * opened by id via `OpenMainContentViewEvent`.
 */
export function registerDesignMainContentViews(): void {
  MainContentViews.register({
    type: DesignStudioViewName,
    component: DesignStudio,
  });
}
