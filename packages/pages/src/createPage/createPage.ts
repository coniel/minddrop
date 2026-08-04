import { DefaultPageLayout, Layout } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { PagesStore } from '../PagesStore';
import { PageCreatedEvent, PageCreatedEventData } from '../events';
import { Page } from '../types';
import { writePage } from '../writePage';

/**
 * Creates a new page, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the page, defaults to the page type name.
 * @returns The created page.
 *
 * @dispatches pages:page:created
 */
export async function createPage(name?: string): Promise<Page> {
  // Build the page's layout from the default page layout
  const layout: Layout = {
    ...DefaultPageLayout,
    id: entityId('layout'),
    name: i18n.t('designs.layouts.page.name'),
    created: new Date(),
    lastModified: new Date(),
  };

  // Generate the page object
  const page: Page = {
    id: entityId('page'),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('labels.untitled'),
    layout,
    properties: {},
  };

  // Add the page to the store
  PagesStore.set(page);

  // Write the page config to the file system
  await writePage(page.id);

  // Dispatch the page created event
  Events.dispatch<PageCreatedEventData>(PageCreatedEvent, page);

  return page;
}
