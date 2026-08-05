import { DefaultPageLayout, Layout } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { PagesStore } from '../PagesStore';
import { DefaultPageIcon } from '../constants';
import { PageCreatedEvent, PageCreatedEventData } from '../events';
import { Page } from '../types';
import { writePage } from '../writePage';

export interface CreatePageOptions {
  /**
   * The name of the page. Defaults to 'Untitled'.
   */
  name?: string;

  /**
   * The page icon. Defaults to the default page icon.
   */
  icon?: string;

  /**
   * The layout to base the page's layout on. Defaults to the
   * default page layout.
   */
  layout?: Layout;
}

/**
 * Creates a new page, adding it to the store and writing it to the
 * file system.
 *
 * @param options - The page creation options.
 * @returns The created page.
 *
 * @dispatches pages:page:created
 */
export async function createPage(
  options: CreatePageOptions = {},
): Promise<Page> {
  // Use the provided layout as the base, or the default page layout
  const baseLayout = options.layout || DefaultPageLayout;

  // Build the page's layout as an independent copy of the base
  // layout with its own ID
  const layout: Layout = {
    ...structuredClone(baseLayout),
    id: entityId('layout'),
    created: new Date(),
    lastModified: new Date(),
  };

  // The default page layout's name is an i18n key, translate it
  if (!options.layout) {
    layout.name = i18n.t('designs.layouts.page.name');
  }

  // Generate the page object
  const page: Page = {
    id: entityId('page'),
    created: new Date(),
    lastModified: new Date(),
    name: options.name || i18n.t('labels.untitled'),
    icon: options.icon || DefaultPageIcon,
    layout,
  };

  // Add the page to the store
  PagesStore.set(page);

  // Write the page config to the file system
  await writePage(page.id);

  // Dispatch the page created event
  Events.dispatch<PageCreatedEventData>(PageCreatedEvent, page);

  return page;
}
