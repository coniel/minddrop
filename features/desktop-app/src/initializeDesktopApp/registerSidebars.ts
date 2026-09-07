import { Views } from '@minddrop/views';
import { AppSidebar } from '../AppSidebar';
import { DefaultSidebarFillId } from '../constants';

/**
 * Registers the sidebar fills the shell's sidebar slot can render.
 */
export function registerSidebars(): void {
  // The app sidebar, shown when the active session claims no sidebar
  Views.registerFill('sidebar', {
    id: DefaultSidebarFillId,
    component: AppSidebar,
  });
}
