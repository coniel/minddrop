import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { Icons } from '@minddrop/ui-icons';
import { entityId } from '@minddrop/utils';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewEntityType } from '../constants';
import { ContentViewCreatedEvent } from '../events';
import { extractContentViewReferences } from '../extractContentViewReferences';
import { ContentView, ViewDataSource } from '../types';
import { writeContentView } from '../writeContentView';

/**
 * Creates a new content view of the specified type.
 *
 * @param type - The type of content view to create.
 * @param dataSource - The data source for the content view.
 * @param name - The name of the content view, defaults to the content view type name.
 * @returns The created content view.
 *
 * @throws {NotRegisteredError} If the content view type is not registered.
 *
 * @dispatches content-views:content-view:created
 */
export async function createContentView(
  type: string,
  dataSource: ViewDataSource,
  name?: string,
): Promise<ContentView> {
  // Get the content view type
  const viewType = ContentViewTypesRegistry.get(type);

  // Create the content view with the content view type's default icon
  const view: ContentView = {
    id: entityId(ContentViewEntityType),
    dataSource,
    type: type,
    name: name || i18n.t(viewType.name),
    icon: Icons.fromName(viewType.icon),
    created: new Date(),
    lastModified: new Date(),
  };

  // If the content view type has default options, merge them into the content view
  if (viewType?.defaultOptions) {
    view.options = { ...viewType.defaultOptions, ...view.options };
  }

  // If the content view type has default data, merge it into the content view
  if (viewType?.defaultData) {
    view.data = { ...viewType.defaultData };
  }

  // Index the item references within the view's config
  view.references = extractContentViewReferences(view.type, {
    options: view.options,
    data: view.data,
  });

  // Add the content view to the store
  ContentViewsStore.set(view);

  // Dispatch a content view created event
  Events.dispatch(ContentViewCreatedEvent, view);

  // Write the content view to the file system
  await writeContentView(view.id);

  return view;
}
