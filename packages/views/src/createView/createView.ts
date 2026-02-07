import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Paths, uuid } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewsDirectory } from '../constants';
import { ViewCreatedEvent } from '../events';
import { View } from '../types';
import { writeViewConfig } from '../writeViewConfig';

export type CreateViewData = Omit<View, 'id' | 'created' | 'lastModified'>;

/**
 * Creates a new view, adding it to the store and writing it to the file system.
 *
 * @param data - The view data.
 * @returns The created view.
 *
 * @dispatches 'views:view:created' event
 */
export async function createView(
  type: string,
  contentType: View['contentType'],
): Promise<View> {
  // Use 'View' as the default view name
  let viewName = i18n.t('views.labels.view');

  // Generate the view path and name, incrementing the name if necessary
  const { path, increment } = await Fs.incrementalPath(
    Fs.concatPath(Paths.workspace, ViewsDirectory, `${viewName}.view`),
  );

  // Generate the view object
  const view: View = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    type,
    contentType,
    content: [],
    name: increment ? `${viewName} ${increment}` : viewName,
    path,
  };

  // Add the view to the store
  ViewsStore.add(view);

  // Write the view config to the file system
  await writeViewConfig(view.id);

  // Dispatch the view created event
  Events.dispatch(ViewCreatedEvent, view);

  return view;
}
