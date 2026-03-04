import { DefaultContainerElementStyle } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
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
  // Generate the page object
  const page: Page = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('labels.untitled'),
    tree: {
      id: 'root',
      type: 'root',
      style: DefaultContainerElementStyle,
      children: [],
    },
  };

  // Add the page to the store
  PagesStore.set(page);

  // Write the page config to the file system
  await writePage(page.id);

  // Dispatch the page created event
  Events.dispatch<PageCreatedEventData>(PageCreatedEvent, page);

  return page;
}
