import { DefaultPageLayout } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { PropertyMap } from '@minddrop/properties';
import { entityId } from '@minddrop/utils';
import { PagesStore } from '../PagesStore';
import { PageCreatedEvent, PageCreatedEventData } from '../events';
import { Page } from '../types';
import { prunePageProperties } from '../utils';
import { writePage } from '../writePage';

export interface CreatePageOptions {
  /**
   * The name of the page. Defaults to 'Untitled'.
   */
  name?: string;

  /**
   * The ID of the page layout used to render the page. Defaults to
   * the default page layout.
   */
  layout?: string;

  /**
   * Initial values for the design properties bound in the layout,
   * keyed by property name.
   */
  properties?: PropertyMap;
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
  // Use the provided layout, or the default page layout
  const layout = options.layout || DefaultPageLayout.id;

  // Generate the page object
  const page: Page = {
    id: entityId('page'),
    created: new Date(),
    lastModified: new Date(),
    name: options.name || i18n.t('labels.untitled'),
    layout,
    // Drop initial values for properties not bound in the layout
    properties: prunePageProperties(layout, options.properties || {}),
  };

  // Add the page to the store
  PagesStore.set(page);

  // Write the page config to the file system
  await writePage(page.id);

  // Dispatch the page created event
  Events.dispatch<PageCreatedEventData>(PageCreatedEvent, page);

  return page;
}
