import { Views } from '@minddrop/views';
import { PageView } from './PageView';
import { PageViewName } from './events';

/**
 * Registers the pages feature's views.
 */
export function registerPageViews(): void {
  // Register the page view
  Views.register({ type: PageViewName, component: PageView });
}
