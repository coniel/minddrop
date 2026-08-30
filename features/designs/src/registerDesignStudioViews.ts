import { DesignsIcon } from '@minddrop/designs';
import { Views } from '@minddrop/views';
import { DesignStudio } from './DesignStudio';
import { DesignStudioViewName, DesignStudioViewTitle } from './constants';

/**
 * Registers the design studio views.
 */
export function registerDesignStudioViews(): void {
  // Register the design studio view
  Views.register({
    type: DesignStudioViewName,
    component: DesignStudio,
    title: DesignStudioViewTitle,
    icon: DesignsIcon,
  });
}
