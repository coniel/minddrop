import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { Icons } from '@minddrop/ui-icons';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewCreatedEvent } from '../events';
import { extractContentViewReferences } from '../extractContentViewReferences';
import { ContentView, CreateVirtualContentViewData } from '../types';

/**
 * Creates a virtual content view that exists only in memory.
 * Virtual content views are not persisted to the file system.
 *
 * @param viewData - The content view data. Requires id, type, and dataSource. Name defaults to the content view type name. Options are merged over the content view type's default options.
 * @returns The created virtual content view.
 *
 * @throws {NotRegisteredError} If the content view type is not registered.
 *
 * @dispatches content-views:content-view:created
 */
export function createVirtualContentView(
  viewData: CreateVirtualContentViewData,
): ContentView {
  // Get the content view type
  const viewType = ContentViewTypesRegistry.get(viewData.type);

  // Generate the virtual content view object
  const view: ContentView = {
    id: viewData.id,
    virtual: true,
    owner: viewData.owner,
    dataSource: viewData.dataSource,
    type: viewData.type,
    name: viewData.name || i18n.t(viewType.name),
    icon: Icons.fromName(viewType.icon),
    created: new Date(),
    lastModified: new Date(),
  };

  // Set the owner key if provided
  if (viewData.ownerKey) {
    view.ownerKey = viewData.ownerKey;
  }

  // Merge content view type default options with any provided options
  if (viewType?.defaultOptions || viewData.options) {
    view.options = { ...viewType?.defaultOptions, ...viewData.options };
  }

  // Set content view data if provided
  if (viewData.data) {
    view.data = viewData.data;
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

  return view;
}
